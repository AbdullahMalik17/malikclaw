package main

import (
	"bytes"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

// SkillManifest defines the structure of a skill's metadata and permissions.
type SkillManifest struct {
	Name         string   `json:"name"`
	Slug         string   `json:"slug"`
	Version      string   `json:"version"`
	Author       string   `json:"author"`
	Permissions  []string `json:"permissions"`
	Description  string   `json:"description"`
}

// SkillPackage represents the data received during publication.
type SkillPackage struct {
	Manifest  SkillManifest `json:"manifest"`
	Blob      string        `json:"blob"`      // Hex encoded WASM/JSON
	Signature string        `json:"signature"` // Hex encoded signature
	PubKey    string        `json:"pub_key"`   // Hex encoded developer public key
}

// MemoryStore provides a simple thread-safe store for demonstration.
type MemoryStore struct {
	mu     sync.RWMutex
	skills map[string]SkillPackage
}

var store = &MemoryStore{
	skills: make(map[string]SkillPackage),
}

// ForbiddenPermissions contains keywords that are rejected for security.
var ForbiddenPermissions = []string{"root", "admin", "system", "kernel", "*"}

func main() {
	mux := http.NewServeMux()

	// Endpoints
	mux.HandleFunc("POST /api/v1/skills/publish", publishHandler)
	mux.HandleFunc("GET /api/v1/skills/discover", discoverHandler)

	// Middleware integration
	handler := loggingMiddleware(mux)

	server := &http.Server{
		Addr:         ":8080",
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	log.Printf("Skill Registry Service starting on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

// Middleware
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.RequestURI, time.Since(start))
	})
}

// Handlers
func publishHandler(w http.ResponseWriter, r *http.Request) {
	var pkg SkillPackage
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	r.Body = io.NopCloser(bytes.NewBuffer(body)) // Reset for possible middleware use

	if err := json.Unmarshal(body, &pkg); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// 1. Manifest Validation (Permissions Check)
	for _, p := range pkg.Manifest.Permissions {
		lowerP := strings.ToLower(p)
		for _, forbidden := range ForbiddenPermissions {
			if strings.Contains(lowerP, forbidden) {
				http.Error(w, fmt.Sprintf("Security violation: permission '%s' is prohibited", p), http.StatusForbidden)
				return
			}
		}
	}

	// 2. Cryptographic Verification
	// We verify the signature over the hex-encoded blob.
	// In production, you might sign the entire manifest+blob hash.
	blobHash := hex.EncodeToString([]byte(pkg.Blob)) // Simplification for core demo
	if err := VerifySignature(pkg.PubKey, blobHash, pkg.Signature); err != nil {
		http.Error(w, "Zero-Trust Failure: "+err.Error(), http.StatusUnauthorized)
		return
	}

	// 3. Persist
	store.mu.Lock()
	store.skills[pkg.Manifest.Slug] = pkg
	store.mu.Unlock()

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "published", "slug": pkg.Manifest.Slug})
}

func discoverHandler(w http.ResponseWriter, r *http.Request) {
	store.mu.RLock()
	defer store.mu.RUnlock()

	var list []SkillManifest
	for _, pkg := range store.skills {
		list = append(list, pkg.Manifest)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}
