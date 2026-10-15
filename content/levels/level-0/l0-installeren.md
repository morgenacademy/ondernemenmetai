Je hebt drie dingen nodig: **git** (houdt elke versie van je bestanden bij), de **GitHub CLI** (laat je computer veilig inloggen bij GitHub) en je **AI-tool**.

<!-- alleen:mac -->
**Op je Mac**

1. Open **Terminal** (Cmd+spatie, typ "Terminal").
2. Installeer Homebrew, de app-winkel voor ontwikkeltools. Plak dit en druk op Enter:

   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

   Lees wat Homebrew aan het eind zegt. Soms vraagt het je nog twee regels te plakken.
3. Installeer git en de GitHub CLI:

   ```
   brew install git gh
   ```
<!-- /alleen -->
<!-- alleen:windows -->
**Op je Windows-computer**

1. Open **PowerShell** (Start, typ "PowerShell").
2. Installeer git en de GitHub CLI:

   ```
   winget install --id Git.Git -e --source winget
   winget install --id GitHub.cli -e --source winget
   ```

3. Sluit PowerShell en open hem opnieuw, zodat de nieuwe programma's gevonden worden.
<!-- /alleen -->

Log daarna in bij GitHub met `gh auth login`. Kies **GitHub.com**, **HTTPS** en **Login with a web browser**.

<!-- alleen:claude-code -->
**Claude Code:** download de Claude-app via claude.ai/download, log in en open het tabblad **Code**.
<!-- /alleen -->
<!-- alleen:codex -->
**Codex:** installeer Codex volgens de instructies op developers.openai.com/codex en log in met je ChatGPT-account.
<!-- /alleen -->
