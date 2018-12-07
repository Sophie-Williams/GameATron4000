# The Three Trials

TODO Rename Bot Channels Registration to Azure Bot Service
TODO Rename Resource Group To GameATron4000RG

# Prerequisites

To use these tools from the command line, you will need Node.js installed to your machine:

- [Node.js (v8.5 or greater)](https://nodejs.org/)
- [.NET Core SDK version 2.1.403 or higher](https://www.microsoft.com/net/download)

## Install tools

- [Install latest version of the Azure CLI.](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Install Bot Builder tools.](https://aka.ms/botbuilder-tools-readme)

You can now manage bots using Azure CLI like any other Azure resource.

Login to Azure CLI by running the following command:

```shell
az login
```

Alternatively, you can use the Cloud Shell in the Azure portal.

# Trial I: Testing locally

## ...

1. Clone the Bot

2. Open in Visual Studio Code and Start the application.

## Test locally using the Emulator

1. In Visual Studio Code, select **Debug | Start Debugging**.

2. In the web browser that opens, make a note of the URL.

3. Start the Bot Framework Emulator.

4. Select **File | New Bot Configuration...**.

5. On the **New bot configuration** dialog, enter *GameATron4000* as the bot name and the endpoint you saved from the browser when you started debugging. Leave the MSA app ID and MSA app password blank for now.

> [IMAGE]

5. Click **Save and connect**, name your bot file *GameATron4000.bot*, and save the file in the Game-a-Tron 4000 project folder.

> test bot - 7. In the Type your message field, enter a message like Hello, World and press Enter. You should see what you typed followed by the bot’s reply like the following:

6. In Visual Studio, select **Debug | Stop Debugging**.

## Test locally using the Point & Click client

The Game-A-Tron 4000 graphical user interface uses a Direct Line Channel to connect to the bot. To get a Direct Line Channel the bot needs to be registered with the Azure Bot Service. This is just a registration to make use of the provided channels, the bot code itself can run anywhere you want.

### Install and run ngrok

For now, we'll just keep it running on your local machine. You'll use **ngrok** to forward messages from the Azure Bot Service on the web directly to your local machine to allow debugging.

1. Download ngrok from https://ngrok.com/download.

2. From the command line, run the following command:

```
ngrok http -host-header=rewrite 5000
```

3. When ngrok starts, it will display the public forwarding HTTPS URL you’ll need to copy and save for later, as highlighted below:

> SCREENSHOT

### Register an Azure AD application

To secure the connection between the Azure Bot Service and the bot, register an application with Azure AD to get a Microsoft app ID and password.

1. To register an application with Azure AD execute the following command from the command line (or Cloud Shell in Azure Portal):

```
az ad app create --display-name GameATron4000 \
    --identifier-uris uri:gameatron4000
    --password <Choose a MSA password>
```

After the command has completed, the output JSON will contain an ```appId``` element with the MSA app ID. Make a note of it as you'll need it shortly.

### Create the Azure Bot Service registration

We'll use the Azure CLI tool to create the Azure Bot Service registration. Alternatively, you can use the Cloud Shell in the Azure Portal, or the Portal UI.

1. Now let’s create the actual registration. Start by creating a resource group:

```
az group create --name GameATron4000RG --location westus
```

2. Use this newly created Resource Group as the default group in any subsequent
commands so we don't have to type it in each time. Tell the CLI that we want
everything stored in the West US data center too.

```
az configure --defaults group=GameATron4000RG location=westus
```

3. Create the registration using the ngrok public forwarding HTTPS URL. Note that ```/api/messages``` must be appended to get the full endpoint URL.

```
az bot create \
    --kind registration \
    --name GameATron4000Reg \
    --appid <MSA app ID>
    --password <MSA password>
    --endpoint <ngrok HTTPS URL>/api/messages \
    --sku F0
```

4. Create the Direct Line channel for the bot:

```
az bot directline create --name GameATron4000Reg
```

After the command has completed, the output JSON will contain a ```key``` element with the Direct Line secret.

## Update the .bot file

A .bot file acts as the place to bring all service references together to enable tooling. Game-A-Tron 4000 uses the .bot file to load service configuration information such as the bot name,  MSA app ID and password, and the Direct Line secret.

You previously created a .bot file using the Bot Framework Emulator. Now that  You will now add information on the Bot Channels Registration and the Direct Line channel to the .bot file.

1. Switch back to the emulator, right-click on the endpoint, and select **Edit settings**.

2. Fill in the MSA app ID and password and click **Submit**.

You can also use the [MSBot](https://github.com/Microsoft/botbuilder-tools/blob/master/packages/MSBot/README.md) tool to add information to a .bot file. Let's use this tool to add configuration information for the Azure Bot Service registration and Direct Line channel. Run the tool from the Game-A-Tron 4000 project folder. It will automatically find and update your .bot file:

3. Add the service configuration information for the Azure Bot Service registration:

```
msbot connect bot \
    --serviceName GameATron4000Reg \
    --tenantId <ID of the Azure tenant, e.g. xxx.onmicrosoft.com> \
    --subscriptionId <Azure Subscription ID> \
    --resourceGroup GameATron4000RG \
    --appId <MSA app ID> \
    --appPassword <MSA app password> \
    --endpoint <ngrok-https-url>/api/messages
```

4.

```
msbot connect generic \
    --name DirectLine \
    --url "no-url" \
    --keys "{\"secret\":\"<Direct Line secret>\"}"
```


-----------------




 We’ll need both the *appId* and the *appPassword* in the bot channels registration.  

> AppId = "appId": "1c085911-0e8f-4271-8ef7-63af76b9b4a9",  
> Password = Snake220  

