# Hands-on Labs

## Prerequisites

Ensure that the following tools are installed on your machine:

- [Node.js (v8.5 or greater)](https://nodejs.org/)
- [.NET Core SDK version 2.1.403 or higher](https://www.microsoft.com/net/download)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Latest version of the Azure CLI.](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- [The MSBot command-line tool](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/MSBot)
- [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator)

After installing Visual Studio Code, start it and install the C# plugin:

![](docs/img/vscode-c-sharp-plugin.png)

Login to Azure CLI by running the following command:

```shell
az login
```

Alternatively, you can use the Cloud Shell in the Azure portal.

## The Three Trials

1. [Test the Game-A-Tron 4000™ bot locally.](docs/trial1.md)

2. [Add text translation middleware.](docs/trial2.md)

3. [Add natural language support using LUIS.](docs/trial3.md)