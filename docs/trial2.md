# Trial 2: Add text translation middleware

In this lab you'll learn how to use middleware to intercept messages sent from the bot. We'll use the custom middleware to translate the text in the game using the Microsoft Translator Text API. Microsoft Translator Text API is a cloud-based machine translation service. With this API you can translate text in near real-time from any app or service through a simple REST API call. 

## Configure Microsoft Translator Text API key

1. First obtain a key following the instructions in the [Microsoft Translator Text API documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-text-how-to-signup).

2. Add the key to the .bot file:

```
msbot connect generic --name Translator --url "no-url" --keys "{\"key\":\"<API key>\"}"
```

3. In *BotServices.cs* find the line `// TODO Trial 2: Read translator key from configuration.` and add the following code to read the API key from the .bot file:

```csharp
if (service.Name == "Translator")
{
    var translatorService = (GenericService)service;
    TranslatorKey = translatorService.Configuration["key"];
}
```

## Add middleware to the bot

1. In the *Translator* folder, add a new *TranslatorMiddleware.cs* file with the following class:

```csharp
public class TranslatorMiddleware : IMiddleware
{
    private readonly TranslatorOptions _options;
    private readonly TranslatorClient _client;

    public TranslatorMiddleware(TranslatorOptions options, BotServices connectedServices)
    {
        _options = options;
        _client = new TranslatorClient(connectedServices.TranslatorKey);
    }

    public async Task OnTurnAsync(ITurnContext turnContext, NextDelegate next, CancellationToken cancellationToken = default(CancellationToken))
    {
        // TODO Insert code to translate sent message activities here.
        
        // Call next middleware.
        await next(cancellationToken).ConfigureAwait(false);
    }
}
```

The `IMiddleware` interface declares an `OnTurnAsync` method where we can place our code to intercept the bot activities.  

2. Add the following code to the `OnTurnAsync` method.

```csharp
if (_options.Enabled)
{
    turnContext.OnSendActivities(async (context, activities, nextSend) =>
    {
        IEnumerable<Task> translatorTasks = activities
            .Where(a => a.Type == ActivityTypes.Message)
            .Select(a => a.AsMessageActivity())
            .Select(async activity =>
            {
                activity.Text = await _client.TranslateAsync(activity.Text, _options.Language).ConfigureAwait(false);
            });

        await Task.WhenAll(translatorTasks).ConfigureAwait(false);

        return await nextSend();
    });
}
```

This code listens to all activities sent by the bot, filters out the Message activities and then translates the text within the Message activities using the Translator Text API. 

3. In *Startup.cs* register the translation middleware in the `ConfigureServices` method (there's a TODO comment in the code):

```csharp
services.AddBot<GameBot>(options =>
{
    ...

    // TODO Trial 2: Register middleware here.
    options.Middleware.Add(new TranslatorMiddleware(translatorOptions, connectedServices));

    ...
});

```

## Run the game

1. Open `appsettings.Development.json` and enable the Translator. You can also specify the target language here.

```json
  "Translator": {
    "Enabled": true,
    "Language": "nl"
  },
```

2. Select **Debug | Start Debugging**.

3. In the web browser that opens, remove `/api/messages/` from the URL.

4. Select *Return of the Body Snatchers*.

The game GUI will now load and any Message activities sent from the bot will be translated. Note that not all text in the game is translated yet. For example, the user still needs to input the commands in English. This is mainly because user input must exactly match the scripted commands for the game to react. In the next lab, we'll look at LUIS to improve the bot the accept a more diverse range of commands.
