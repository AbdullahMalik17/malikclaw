param()
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName PresentationCore, PresentationFramework, WindowsBase

$repoRoot = "D:\WEB DEVELOPMENT\malikclaw"
$logoPath = Join-Path $repoRoot "assets\logo.png"
$sansUri = New-Object System.Uri((Join-Path $repoRoot "website\node_modules\geist\dist\fonts\geist-sans\"))
$monoUri = New-Object System.Uri((Join-Path $repoRoot "website\node_modules\geist\dist\fonts\geist-mono\"))

$geistSans = New-Object System.Windows.Media.FontFamily($sansUri, "./#Geist")
$geistMono = New-Object System.Windows.Media.FontFamily($monoUri, "./#Geist Mono")
$urduFont  = New-Object System.Windows.Media.FontFamily("Tahoma, Segoe UI")

function ColorFromHex([string]$hex, [byte]$alpha = 255) {
    $c = [System.Windows.Media.ColorConverter]::ConvertFromString($hex)
    return [System.Windows.Media.Color]::FromArgb($alpha, $c.R, $c.G, $c.B)
}

function BrushFromHex([string]$hex, [byte]$alpha = 255) {
    $b = New-Object System.Windows.Media.SolidColorBrush((ColorFromHex $hex $alpha))
    $b.Freeze()
    return $b
}

function PenFromHex([string]$hex, [byte]$alpha = 255, [double]$thickness = 1.0) {
    $p = New-Object System.Windows.Media.Pen((BrushFromHex $hex $alpha), $thickness)
    $p.Freeze()
    return $p
}

function MakeFormattedText([string]$text, $family, $weight, [double]$size, $brush, [bool]$rtl = $false, [double]$maxWidth = 0) {
    $tf = New-Object System.Windows.Media.Typeface($family, [System.Windows.FontStyles]::Normal, $weight, [System.Windows.FontStretches]::Normal)
    $flow = if ($rtl) { [System.Windows.FlowDirection]::RightToLeft } else { [System.Windows.FlowDirection]::LeftToRight }
    $culture = if ($rtl) { [System.Globalization.CultureInfo]::GetCultureInfo("ur-PK") } else { [System.Globalization.CultureInfo]::InvariantCulture }
    $ft = New-Object System.Windows.Media.FormattedText(
        $text,
        $culture,
        $flow,
        $tf,
        $size,
        $brush,
        1.0
    )
    if ($maxWidth -gt 0) {
        $ft.MaxTextWidth = $maxWidth
    }
    return $ft
}

function DrawRoundedRect($dc, [double]$x, [double]$y, [double]$w, [double]$h, [double]$r, $fillBrush, $pen) {
    $rect = New-Object System.Windows.Rect($x, $y, $w, $h)
    $dc.DrawRoundedRectangle($fillBrush, $pen, $rect, $r, $r)
}

function Render-Banner([int]$W, [int]$H, [string]$OutPath, [string]$FooterUrl) {
    $scaleX = $W / 1280.0
    $scaleY = $H / 640.0

    $visual = New-Object System.Windows.Media.DrawingVisual
    [System.Windows.Media.RenderOptions]::SetBitmapScalingMode($visual, [System.Windows.Media.BitmapScalingMode]::HighQuality)
    [System.Windows.Media.TextOptions]::SetTextFormattingMode($visual, [System.Windows.Media.TextFormattingMode]::Ideal)
    [System.Windows.Media.TextOptions]::SetTextRenderingMode($visual, [System.Windows.Media.TextRenderingMode]::ClearType)

    $dc = $visual.RenderOpen()

    # 1. Obsidian base canvas (#050507)
    $bgRect = New-Object System.Windows.Rect(0, 0, $W, $H)
    $dc.DrawRectangle((BrushFromHex "#050507" 255), $null, $bgRect)

    # 2. Radial spotlight glows (Gryphon Gold top-left + Electric Cyan bottom-right)
    $goldGlow = New-Object System.Windows.Media.RadialGradientBrush
    $goldGlow.GradientOrigin = New-Object System.Windows.Point(0.18, 0.14)
    $goldGlow.Center = New-Object System.Windows.Point(0.18, 0.14)
    $goldGlow.RadiusX = 0.58
    $goldGlow.RadiusY = 0.58
    $goldGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#F59E0B" 44), 0.0)))
    $goldGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#F59E0B" 14), 0.45)))
    $goldGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#050507" 0), 1.0)))
    $dc.DrawRectangle($goldGlow, $null, $bgRect)

    $cyanGlow = New-Object System.Windows.Media.RadialGradientBrush
    $cyanGlow.GradientOrigin = New-Object System.Windows.Point(0.84, 0.78)
    $cyanGlow.Center = New-Object System.Windows.Point(0.84, 0.78)
    $cyanGlow.RadiusX = 0.55
    $cyanGlow.RadiusY = 0.55
    $cyanGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#06B6D4" 40), 0.0)))
    $cyanGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#06B6D4" 12), 0.45)))
    $cyanGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#050507" 0), 1.0)))
    $dc.DrawRectangle($cyanGlow, $null, $bgRect)

    # 3. Subtle 1px architectural grid (36px spacing)
    $gridPen = PenFromHex "#FFFFFF" 11 1.0
    for ($gx = 36; $gx -lt $W; $gx += 36) {
        $dc.DrawLine($gridPen, (New-Object System.Windows.Point($gx, 0)), (New-Object System.Windows.Point($gx, $H)))
    }
    for ($gy = 36; $gy -lt $H; $gy += 36) {
        $dc.DrawLine($gridPen, (New-Object System.Windows.Point(0, $gy)), (New-Object System.Windows.Point($W, $gy)))
    }

    # 4. Outer subtle architectural frame + top gradient hairline
    DrawRoundedRect $dc 20 20 ($W - 40) ($H - 40) 20 $null (PenFromHex "#FFFFFF" 18 1.0)
    $topLineGrad = New-Object System.Windows.Media.LinearGradientBrush
    $topLineGrad.StartPoint = New-Object System.Windows.Point(0, 0)
    $topLineGrad.EndPoint = New-Object System.Windows.Point(1, 0)
    $topLineGrad.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#050507" 0), 0.0)))
    $topLineGrad.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#F59E0B" 180), 0.35)))
    $topLineGrad.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#06B6D4" 180), 0.65)))
    $topLineGrad.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#050507" 0), 1.0)))
    $tx = 140.0 * $scaleX
    $tw = $W - (280.0 * $scaleX)
    $topRect = New-Object System.Windows.Rect($tx, 20.0, $tw, 1.5)
    $dc.DrawRectangle($topLineGrad, $null, $topRect)

    # Central 80% Safe Zone geometry (>= 10% margins on all 4 sides)
    $padX = [Math]::Round(132 * $scaleX)
    $padY = [Math]::Round(68 * $scaleY)
    $rightCardW = [Math]::Round(348 * $scaleX)
    $gapX = [Math]::Round(34 * $scaleX)
    $leftX = $padX
    $leftW = $W - (2 * $padX) - $rightCardW - $gapX
    $rightX = $leftX + $leftW + $gapX

    # --- LEFT COLUMN ---
    $curY = $padY

    # Eyebrow pills
    $pill1Text = MakeFormattedText "MalikClaw v2.0.0 — Agentic Era 2026" $geistMono ([System.Windows.FontWeights]::Bold) (12.0 * $scaleX) (BrushFromHex "#FBBF24")
    $p1W = $pill1Text.Width + [Math]::Round(32 * $scaleX)
    $p1H = [Math]::Round(28 * $scaleY)
    DrawRoundedRect $dc $leftX $curY $p1W $p1H 14 (BrushFromHex "#F59E0B" 34) (PenFromHex "#F59E0B" 120 1.2)
    $dc.DrawEllipse((BrushFromHex "#F59E0B"), $null, (New-Object System.Windows.Point(($leftX + 13 * $scaleX), ($curY + $p1H / 2.0))), 3.5, 3.5)
    $dc.DrawText($pill1Text, (New-Object System.Windows.Point(($leftX + 22 * $scaleX), ($curY + ($p1H - $pill1Text.Height) / 2.0))))

    $pill2X = $leftX + $p1W + [Math]::Round(10 * $scaleX)
    $pill2Text = MakeFormattedText "Pure Go 1.25+ • MIT" $geistMono ([System.Windows.FontWeights]::Bold) (12.0 * $scaleX) (BrushFromHex "#22D3EE")
    $p2W = $pill2Text.Width + [Math]::Round(24 * $scaleX)
    DrawRoundedRect $dc $pill2X $curY $p2W $p1H 14 (BrushFromHex "#06B6D4" 30) (PenFromHex "#06B6D4" 110 1.2)
    $dc.DrawText($pill2Text, (New-Object System.Windows.Point(($pill2X + 12 * $scaleX), ($curY + ($p1H - $pill2Text.Height) / 2.0))))

    $curY += $p1H + [Math]::Round(20 * $scaleY)

    # Headline Line 1: "MalikClaw " (white) + "v2.0.0" (gold gradient)
    $hSize = [Math]::Round(48 * $scaleX)
    $h1a = MakeFormattedText "MalikClaw " $geistSans ([System.Windows.FontWeights]::Black) $hSize (BrushFromHex "#FFFFFF")
    $goldTextBrush = New-Object System.Windows.Media.LinearGradientBrush((ColorFromHex "#FEF08A"), (ColorFromHex "#F59E0B"), 45.0)
    $h1b = MakeFormattedText "v2.0.0" $geistSans ([System.Windows.FontWeights]::Black) $hSize $goldTextBrush
    $dc.DrawText($h1a, (New-Object System.Windows.Point($leftX, $curY)))
    $dc.DrawText($h1b, (New-Object System.Windows.Point(($leftX + $h1a.WidthIncludingTrailingWhitespace), $curY)))

    $curY += [Math]::Round($h1a.Height * 0.96)

    # Headline Line 2: "Agentic Era 2026" (cyan gradient)
    $cyanTextBrush = New-Object System.Windows.Media.LinearGradientBrush((ColorFromHex "#A5F3FC"), (ColorFromHex "#06B6D4"), 35.0)
    $h2 = MakeFormattedText "Agentic Era 2026" $geistSans ([System.Windows.FontWeights]::Black) $hSize $cyanTextBrush
    $dc.DrawText($h2, (New-Object System.Windows.Point($leftX, $curY)))

    $curY += [Math]::Round($h2.Height + 12 * $scaleY)

    # Subheadline (everyday + developer clarity)
    $subText = MakeFormattedText "Autonomous AI for developers & everyday life — WhatsApp, Telegram, Android ADB & local Ollama in English or Urdu." $geistSans ([System.Windows.FontWeights]::Medium) (17.5 * $scaleX) (BrushFromHex "#D4D4D8") $false $leftW
    $subText.LineHeight = 24 * $scaleY
    $dc.DrawText($subText, (New-Object System.Windows.Point($leftX, $curY)))

    $curY += [Math]::Round($subText.Height + 20 * $scaleY)

    # 3 Metric Cards: <10MB RAM | <1s Boot | $10 Hardware
    $cardGap = [Math]::Round(10 * $scaleX)
    $cardW = ($leftW - (2 * $cardGap)) / 3.0
    $cardH = [Math]::Round(74 * $scaleY)
    $metrics = @(
        @{ Val = '<10MB RAM';    Lbl = '99% lighter core SLA';   Accent = '#F59E0B' },
        @{ Val = '<1s Boot';     Lbl = 'Single static Go binary'; Accent = '#06B6D4' },
        @{ Val = '$10 Hardware'; Lbl = 'SBC • Laptop • Termux';  Accent = '#10B981' }
    )
    for ($i = 0; $i -lt 3; $i++) {
        $cx = $leftX + ($i * ($cardW + $cardGap))
        $m = $metrics[$i]
        DrawRoundedRect $dc $cx $curY $cardW $cardH 13 (BrushFromHex "#0B0C10" 235) (PenFromHex "#FFFFFF" 30 1.0)
        $dc.DrawRectangle((BrushFromHex $m.Accent 230), $null, (New-Object System.Windows.Rect(($cx + 12), $curY, ($cardW - 24), 2.5)))
        $mv = MakeFormattedText $m.Val $geistSans ([System.Windows.FontWeights]::Black) (19.0 * $scaleX) (BrushFromHex "#FFFFFF")
        $ml = MakeFormattedText $m.Lbl $geistMono ([System.Windows.FontWeights]::Medium) (10.8 * $scaleX) (BrushFromHex "#A1A1AA")
        $dc.DrawText($mv, (New-Object System.Windows.Point(($cx + 13 * $scaleX), ($curY + 15 * $scaleY))))
        $dc.DrawText($ml, (New-Object System.Windows.Point(($cx + 13 * $scaleX), ($curY + 44 * $scaleY))))
    }

    $curY += $cardH + [Math]::Round(15 * $scaleY)

    # Pillars Bar: SSRF Firewall • Prompt Guard • Smart Cost Router • MCP + SKILL.md
    $pBarH = [Math]::Round(40 * $scaleY)
    DrawRoundedRect $dc $leftX $curY $leftW $pBarH 11 (BrushFromHex "#0E1017" 240) (PenFromHex "#06B6D4" 78 1.2)
    $pillarsText = MakeFormattedText "SSRF Firewall • Prompt Guard • Smart Cost Router • MCP + SKILL.md" $geistMono ([System.Windows.FontWeights]::Bold) (12.2 * $scaleX) (BrushFromHex "#E4E4E7")
    $dc.DrawText($pillarsText, (New-Object System.Windows.Point(($leftX + ($leftW - $pillarsText.Width) / 2.0), ($curY + ($pBarH - $pillarsText.Height) / 2.0))))

    $curY += $pBarH + [Math]::Round(16 * $scaleY)

    # Bottom row: Urdu accent badge + canonical URL
    $urduStr = "آگے بڑھو، ملک کلاؤ!"
    $urduFt = MakeFormattedText $urduStr $urduFont ([System.Windows.FontWeights]::Bold) (17.0 * $scaleX) (BrushFromHex "#FEF08A") $true
    $uPadW = $urduFt.Width + [Math]::Round(30 * $scaleX)
    $uPadH = [Math]::Round(36 * $scaleY)
    DrawRoundedRect $dc $leftX $curY $uPadW $uPadH 11 (BrushFromHex "#F59E0B" 34) (PenFromHex "#F59E0B" 110 1.1)
    $urduFtCenter = MakeFormattedText $urduStr $urduFont ([System.Windows.FontWeights]::Bold) (17.0 * $scaleX) (BrushFromHex "#FEF08A") $true $uPadW
    $urduFtCenter.TextAlignment = [System.Windows.TextAlignment]::Center
    $dc.DrawText($urduFtCenter, (New-Object System.Windows.Point($leftX, ($curY + ($uPadH - $urduFtCenter.Height) / 2.0))))

    $urlFt = MakeFormattedText $FooterUrl $geistMono ([System.Windows.FontWeights]::Bold) (12.5 * $scaleX) (BrushFromHex "#22D3EE")
    $dc.DrawText($urlFt, (New-Object System.Windows.Point(($leftX + $leftW - $urlFt.Width), ($curY + ($uPadH - $urlFt.Height) / 2.0))))

    # --- RIGHT COLUMN (Showcase Card) ---
    $cardTop = $padY + [Math]::Round(4 * $scaleY)
    $cardHeight = ($curY + $uPadH) - $cardTop
    $scGrad = New-Object System.Windows.Media.LinearGradientBrush((ColorFromHex "#11131C" 245), (ColorFromHex "#08090D" 250), 155.0)
    DrawRoundedRect $dc $rightX $cardTop $rightCardW $cardHeight 22 $scGrad (PenFromHex "#FFFFFF" 34 1.2)

    # Embedded logo.png with rounded clip + cyan/gold rim
    $logoSize = [Math]::Round(164 * $scaleY)
    $logoX = $rightX + ($rightCardW - $logoSize) / 2.0
    $logoY = $cardTop + [Math]::Round(22 * $scaleY)

    # Glow behind logo
    $logoGlow = New-Object System.Windows.Media.RadialGradientBrush
    $logoGlow.GradientOrigin = New-Object System.Windows.Point(0.5, 0.5)
    $logoGlow.Center = New-Object System.Windows.Point(0.5, 0.5)
    $logoGlow.RadiusX = 0.5
    $logoGlow.RadiusY = 0.5
    $logoGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#06B6D4" 72), 0.0)))
    $logoGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#F59E0B" 38), 0.55)))
    $logoGlow.GradientStops.Add((New-Object System.Windows.Media.GradientStop((ColorFromHex "#050507" 0), 1.0)))
    $dc.DrawEllipse($logoGlow, $null, (New-Object System.Windows.Point(($logoX + $logoSize / 2.0), ($logoY + $logoSize / 2.0))), ($logoSize * 0.72), ($logoSize * 0.72))

    # Rim gradient border
    $rimGrad = New-Object System.Windows.Media.LinearGradientBrush((ColorFromHex "#06B6D4" 210), (ColorFromHex "#F59E0B" 210), 45.0)
    $rimPen = New-Object System.Windows.Media.Pen($rimGrad, 2.5)
    DrawRoundedRect $dc ($logoX - 2) ($logoY - 2) ($logoSize + 4) ($logoSize + 4) 28 $null $rimPen

    $bmp = New-Object System.Windows.Media.Imaging.BitmapImage
    $bmp.BeginInit()
    $bmp.UriSource = New-Object System.Uri($logoPath)
    $bmp.CacheOption = [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad
    $bmp.EndInit()
    $bmp.Freeze()

    $clipGeo = New-Object System.Windows.Media.RectangleGeometry((New-Object System.Windows.Rect($logoX, $logoY, $logoSize, $logoSize)), 26, 26)
    $dc.PushClip($clipGeo)
    $dc.DrawImage($bmp, (New-Object System.Windows.Rect($logoX, $logoY, $logoSize, $logoSize)))
    $dc.Pop()

    # Miniature Gateway Security & Router Terminal Card
    $termX = $rightX + [Math]::Round(18 * $scaleX)
    $termW = $rightCardW - [Math]::Round(36 * $scaleX)
    $termY = $logoY + $logoSize + [Math]::Round(20 * $scaleY)
    $termH = ($cardTop + $cardHeight - [Math]::Round(18 * $scaleY)) - $termY
    DrawRoundedRect $dc $termX $termY $termW $termH 14 (BrushFromHex "#050507" 250) (PenFromHex "#FFFFFF" 28 1.0)

    # Term header bar
    $thH = [Math]::Round(26 * $scaleY)
    $dc.DrawLine((PenFromHex "#FFFFFF" 20 1.0), (New-Object System.Windows.Point($termX, ($termY + $thH))), (New-Object System.Windows.Point(($termX + $termW), ($termY + $thH))))
    $dc.DrawEllipse((BrushFromHex "#EF4444"), $null, (New-Object System.Windows.Point(($termX + 13), ($termY + $thH / 2.0))), 3.8, 3.8)
    $dc.DrawEllipse((BrushFromHex "#F59E0B"), $null, (New-Object System.Windows.Point(($termX + 24), ($termY + $thH / 2.0))), 3.8, 3.8)
    $dc.DrawEllipse((BrushFromHex "#10B981"), $null, (New-Object System.Windows.Point(($termX + 35), ($termY + $thH / 2.0))), 3.8, 3.8)
    $thTitle = MakeFormattedText "malikclaw gateway :18790" $geistMono ([System.Windows.FontWeights]::Medium) (10.0 * $scaleX) (BrushFromHex "#A1A1AA")
    $dc.DrawText($thTitle, (New-Object System.Windows.Point(($termX + $termW - $thTitle.Width - 11), ($termY + ($thH - $thTitle.Height) / 2.0))))

    # Term rows
    $rows = @(
        @{ Key = "SSRF Firewall";     Val = "ENFORCED";    Color = "#22D3EE" },
        @{ Key = "Prompt Guard";      Val = "ISOLATED";    Color = "#22D3EE" },
        @{ Key = "Smart Cost Router"; Val = "Ollama → AI"; Color = "#FBBF24" },
        @{ Key = "MCP + SKILL.md";    Val = "21 Channels"; Color = "#FBBF24" }
    )
    $rowStartY = $termY + $thH + [Math]::Round(11 * $scaleY)
    $availH = ($termY + $termH - 8) - $rowStartY
    $rowStep = $availH / 4.0
    for ($r = 0; $r -lt $rows.Count; $r++) {
        $ry = $rowStartY + ($r * $rowStep)
        $item = $rows[$r]
        $ck = MakeFormattedText "✓" $geistMono ([System.Windows.FontWeights]::Bold) (11.2 * $scaleX) (BrushFromHex "#34D399")
        $kf = MakeFormattedText $item.Key $geistMono ([System.Windows.FontWeights]::Medium) (11.2 * $scaleX) (BrushFromHex "#E4E4E7")
        $vf = MakeFormattedText $item.Val $geistMono ([System.Windows.FontWeights]::Bold) (11.2 * $scaleX) (BrushFromHex $item.Color)
        $dc.DrawText($ck, (New-Object System.Windows.Point(($termX + 12), $ry)))
        $dc.DrawText($kf, (New-Object System.Windows.Point(($termX + 27), $ry)))
        $dc.DrawText($vf, (New-Object System.Windows.Point(($termX + $termW - $vf.Width - 12), $ry)))
    }

    $dc.Close()

    # Render to exact pixel bitmap (96 DPI)
    $rtb = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($W, $H, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
    $rtb.Render($visual)

    $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($rtb))

    $outDir = Split-Path -Parent $OutPath
    if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }

    $fs = New-Object System.IO.FileStream($OutPath, [System.IO.FileMode]::Create)
    try {
        $encoder.Save($fs)
    } finally {
        $fs.Dispose()
    }
    Write-Host "Rendered $OutPath ($W x $H)"
}

Render-Banner 1280 640 (Join-Path $repoRoot "assets\social-preview.png") "github.com/AbdullahMalik17/malikclaw"
Render-Banner 1200 630 (Join-Path $repoRoot "website\public\assets\og-banner.png") "malikclaw.vercel.app"
