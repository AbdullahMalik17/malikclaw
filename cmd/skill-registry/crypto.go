package main

import (
	"crypto/ed25519"
	"encoding/hex"
	"errors"
	"fmt"
)

// VerifySignature verifies that the given signature is valid for the message
// using the provided public key. All inputs should be hex-encoded strings.
func VerifySignature(pubKeyHex, messageHex, signatureHex string) error {
	pubKey, err := hex.DecodeString(pubKeyHex)
	if err != nil {
		return fmt.Errorf("invalid public key encoding: %w", err)
	}

	if len(pubKey) != ed25519.PublicKeySize {
		return errors.New("invalid public key size")
	}

	message, err := hex.DecodeString(messageHex)
	if err != nil {
		return fmt.Errorf("invalid message encoding: %w", err)
	}

	sig, err := hex.DecodeString(signatureHex)
	if err != nil {
		return fmt.Errorf("invalid signature encoding: %w", err)
	}

	if len(sig) != ed25519.SignatureSize {
		return errors.New("invalid signature size")
	}

	if !ed25519.Verify(pubKey, message, sig) {
		return errors.New("signature verification failed: cryptographic mismatch")
	}

	return nil
}
