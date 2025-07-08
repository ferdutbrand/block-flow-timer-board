
# Como instalar 3 for time no Windows

## Método 1: Instalação via Navegador (Recomendado)

1. **Abra o aplicativo no seu navegador:**
   - Chrome, Edge ou Firefox
   - Acesse: [URL do seu aplicativo]

2. **Instale como PWA:**
   - **Chrome/Edge:** Clique no ícone de instalação (📱) na barra de endereços
   - **Firefox:** Vá em Menu → Instalar este site como aplicativo
   - Ou use Ctrl+Shift+A

3. **Configuração pós-instalação:**
   - O aplicativo será instalado na área de trabalho
   - Funcionará offline automaticamente
   - Salvamento automático está ativado

## Método 2: Instalação Manual (Avançado)

1. **Baixe os arquivos:**
   - Faça download de todos os arquivos do projeto
   - Extraia em uma pasta (ex: C:\3fortime)

2. **Configure um servidor local:**
   - Instale um servidor web simples (ex: http-server via npm)
   - Execute: `npx http-server` na pasta do projeto

3. **Acesse localmente:**
   - Abra http://localhost:8080 no navegador
   - Siga as instruções do Método 1

## Características da Instalação

### ✅ Benefícios:
- **Peso:** Menos de 5MB instalado
- **Memória:** Baixo consumo (~20-50MB em uso)
- **Offline:** Funciona sem internet
- **Salvamento:** Automático a cada alteração
- **Performance:** Rápido e responsivo

### 🔧 Recursos:
- Notificações sonoras amigáveis
- Alertas 5 minutos antes do fim
- Persistência de dados no localStorage
- Interface minimalista e focada

### 🛡️ Segurança:
- Não requer permissões especiais
- Dados salvos localmente
- Sem telemetria ou tracking
- Código aberto e verificável

## Solução de Problemas

### Problemas comuns:
1. **Aplicativo não funciona offline:**
   - Certifique-se de acessar pelo menos uma vez online
   - Limpe o cache do navegador e tente novamente

2. **Dados não salvam:**
   - Verifique se o localStorage não está bloqueado
   - Execute o navegador como administrador (temporariamente)

3. **Sons não tocam:**
   - Permita reprodução automática de áudio no navegador
   - Verifique as configurações de som do sistema

### Desinstalação:
- **Chrome/Edge:** Configurações → Aplicativos → Encontre "3 for time" → Desinstalar
- **Windows:** Configurações → Aplicativos → Procurar "3 for time" → Desinstalar

## Suporte

Para dúvidas ou problemas:
- Verifique se seu navegador suporta PWA
- Versões suportadas: Chrome 67+, Edge 79+, Firefox 58+
- Sistema: Windows 10+ recomendado
