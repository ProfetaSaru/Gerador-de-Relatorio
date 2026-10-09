# Helper script for automated git commit and push
param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage,
    [string]$Branch = ""
)

$ErrorActionPreference = "Stop"

Write-Host "==> Verificando status do git..." -ForegroundColor Cyan
git status -s

if ([string]::IsNullOrWhiteSpace($Branch)) {
    $Branch = (git branch --show-current).Trim()
}

Write-Host "==> Branch de destino: $Branch" -ForegroundColor Cyan

# Validação se houver package.json
if (Test-Path "package.json") {
    Write-Host "==> Executando validação de build..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build falhou! Abortando commit."
        exit 1
    }
}

Write-Host "==> Adicionando arquivos..." -ForegroundColor Cyan
git add .

Write-Host "==> Criando commit: $CommitMessage" -ForegroundColor Cyan
git commit -m "$CommitMessage"

Write-Host "==> Enviando para o remoto ($Branch)..." -ForegroundColor Cyan
git push origin $Branch

Write-Host "==> Concluído com sucesso!" -ForegroundColor Green
git log -n 1 --oneline
