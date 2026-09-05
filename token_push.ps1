Add-Type -AssemblyName Microsoft.VisualBasic
Add-Type -AssemblyName System.Windows.Forms

$token = [Microsoft.VisualBasic.Interaction]::InputBox(
    "GitHub Personal Access Token (ghp_...) ni shu yerga joylashtiring (Ctrl+V) va OK tugmasini bosing:`n`n(Agar tokeningiz bo'lmasa, 'Bekor qilish' bosing)",
    "Muvozanat 24 - GitHub ga yuklash",
    ""
)

if ([string]::IsNullOrWhiteSpace($token)) {
    [System.Windows.Forms.MessageBox]::Show("Yuklash bekor qilindi.", "Muvozanat 24", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    exit 0
}

$token = $token.Trim()

# Set MinGit in PATH
$env:PATH = "$env:LOCALAPPDATA\Programs\MinGit\cmd;$env:LOCALAPPDATA\Programs\MinGit\mingw64\bin;$env:PATH"

# Push to repository using the provided token
$pushResult = git push "https://$($token)@github.com/AyubParsaev-1981/muvozanat24.git" main 2>&1

if ($LASTEXITCODE -eq 0) {
    # Store token in git credential store so user never needs to enter it again
    git config --global credential.helper wincred
    
    [System.Windows.Forms.MessageBox]::Show(
        "BARCHA MA'LUMOTLAR GITHUB GA MUVAFFAQIYATLI YUKLANDI!`n`nSayt manzili: https://ayubparsaev-1981.github.io/muvozanat24/`n`n(1 daqiqada GitHub Pages da ishga tushadi)",
        "Muvozanat 24 - Muvaffaqiyatli!",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Information
    )
} else {
    [System.Windows.Forms.MessageBox]::Show(
        "Yuklashda xatolik yuz berdi:`n`n$pushResult`n`nIltimos, token ruxsatini (repo) tekshirib qaytadan urinib ko'ring.",
        "Muvozanat 24 - Xatolik",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    )
}
