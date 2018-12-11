# Trial 3 - Adding LUIS
In this module, you're going to integrate the GameATron Bot with LUIS - the Language Understanding Intelligent Service. This is an Azure Cognitive Service that can interpret natural language. 

The current state of the Bot requires a player to enter the commands exactly as they are defined in the game-engine. Typing `lookat newspaper` for instance, would not work and should be `look at newspaper`. In this case you only missed a white-space in the command. But imagine a player typing a command like `inspect newspaper`. This perfectly describes what the intent of the player is, but would also not work because the game-engine expects exactly a command in the form: `look at <object name | actor name>`.

By adding LUIS to the bot, your players will be able to issue commands like `inspect newspaper`. LUIS can then detect the actual command that the player wanted to issue. In LUIS terminology this is called an the *intent*. You can also use LUIS to identify what the object is that you want to execute the command on. In LUIS terminology this is called an *entity*. 

In the schematic overview below you can see how this will technically work:

![](img/luis-integration.png)

In this module you will add LUIS to the solution by executing the labs described below.

## 1. Create a LUIS account and application
In this step you will create a LUIS account. If you already have a LUIS account, you can skip this step obviously.

1. Go to [https://www.luis.ai](https://www.luis.ai "https://www.luis.ai").

2. Click on the `Sign up / Login` button.

3. Sign in with a Microsoft account. A LUIS account will be created and you will be redirected to the registration page. 

4. Answer the registration questions and make sure you agree with the Cognitive Services terms.

Within a LUIS account you can create multiple LUIS applications. In this step you will create an application for the game bot. 

1. Click the `+ Create new app` button.

2. Enter `GameATron4000` as name, `English` as culture and a description:
  
   ![](img/create-luis-app.png)

3. Click the `done` button to create the app.

## 2. Add intents
In order to train your model, you have to add *intents*. An intent is something the user wants to achieve. For the game-engine, every possible command that can be issued by the player needs to be added as an intent. The available commands that re supported by the game are: *look at*, *talk to*, *pick up*, *open*, *close*, *use*, and *give*. 

You will start by adding support for the *look at* command by executing the following steps:

1. Make sure you're logged into the LUIS portal and have selected the LUIS application that you created in Lab 1.

2. Select the `Intents` option under the *App Assets* section in the menu on the left.

3. Click the `+ Add intent` button to add a new intent.

4. Enter `look at` as name for the new intent and click the `Done` button to create it. 

The newly created intent will automatically be selected. Now it is time to add *utterances* to the intent. An utterance is a sentence that LUIS will use to recognize the *look at* intent. The more utterances you add, the better LUIS will be able to determine the intent. Now add a couple of utterances for the *look at* intent:

1. Click the text-box just below the name of the intent to give it focus:

   ![](img/add-utterance.png)

2. Type the following utterances, each followed by `enter`:
	- look at newspaper
	- watch newspaper
	- inspect newspaper
	- gaze upon newspaper
	- examine newspaper

Now you have provided LUIS with several utterances that all express the intent to look at something. But LUIS cannot yet determine what it is that you want to look at. To enable LUIS to determine that, you need to provide LUIS with *entities*. Execute the following Lab to add the game entities.  

## 3. Add entities
All the utterances that you added in Lab 2 contained the object *newspaper*. This is one of the objects that are supported in the game-engine. The complete list of supported entities is: *newspaper*, *todolist*, *grocery list*, *bags of groceries* and *fridge*. 

You will add these entities to the model by executing the following steps:

1. Make sure you're logged into the LUIS portal and have selected the LUIS application that you created in Lab 1.

2. Select the `Entities` option under the *App Assets* section in the menu on the left.

3. Click the `+ Create new entity` button.

4. Name the new entity *GameObject*, select *List* as entity type and click the `Done` button to create the new Entity.

The newly created entity will automatically be selected. Now you will add values to this entity by executing the following steps:

1. Click the `Add new sublist` text-box.

2. Enter the word `newspaper` followed by `enter`.  

3. Click the *Synonyms* column of the new *newspaper* row to add synonyms and add the following synonyms (each one followed by `enter)`:
	- paper
	- papers
	- tabloid
	- news
	- magazine  

Your screen should look  something like this:

![](img/add-entity-synonyms.png)

If you now go back and look at the *look at* intent, you will see that LUIS already recognized that the *newspaper* term in the utterances you specified corresponds to the *GameObject* entity:

![](img/utterances-with-entity.png)

Now it's time to train and publish the model so you can use it in the game-engine.

## 4. Train and publish the model
Train and publish the model by executing the following steps:

1. Make sure you're logged into the LUIS portal and have selected the LUIS application that you created in Lab 1.

2. Click the `Train` button in the top-right of the portal and wait for the notification to appear that training has been finished successfully. 

3. Click the `Publish` button in the top-right of the portal.

4. Select *Production* as environment and click the `Publish` button to publish the model.

In order to use the model from the game-engine, you need to collect a couple of properties of the published application:  

1. Click the `Manage` option in the top-right of the portal.

2. Copy the *Application Id* of the application on the *Application Information* tab and store it somewhere.

3. Go to the *Keys and Endpoints* tab.

4. Copy the *Authoring Key* and store it somewhere.

5. Copy the *Region* from the *Starter_Key* row in the resources table and store it somewhere. 

![](img/copy-app-keys.png)

## 5. Add LUIS to the game-engine
Now that you have a trained and published the model, it's time to integrate it with the bot. 

### Generate the LUIS model
LUIS offers a .NET Core CLI tool for generating a helper class for interpreting the result of a call to your LUIS model. The input for this tool is an export of your trained LUIS model. Such an export can be made from the LUIS portal, but I have already added the exported model to the project. It is in the `luismodel-0.1.json` file in the root of the project.   

Execute the following steps to generate the LUISModel class:

1. Install luisgen on your machine by opening a command-prompt and issuing the following command: `dotnet tool install -g LUISGen`

2. Change the current working-folder to the GameATron4000 project root-folder.

3. Issue the following command: `luisgen luismodel-0.1.json -cs LUISModel`. A file called `LUISModel.cs` will be created. You can examine the generated code in VS Code.

### *ToCommand* extension method
In order to make using the generated LUISModel class as easy as possible, you will created an extension-method `ToCommand` to the LUISModel class. 

Execute the following steps to add the extension-method:

1. Add a new file called `LUISMOdel.Extensions.cs` to the root of the project.

2. Paste the following code-snippet into the file:
	```csharp
	using System.Collections.Generic;
	using System.Linq;
	using System.Threading.Tasks;
	
	namespace Luis
	{
	    public static class LUISModelExtensions
	    {
	        public static string ToCommand(this LUISModel recognizerResult)
	        {
	            // parse LUIS results to get intent and entity
	            string intent = GetLUISIntent(recognizerResult);
	            if (intent != null)
	            {
	                IEnumerable<string> entities = GetLUISEntities(recognizerResult);
	                if (entities.Count() > 0)
	                {
	                    switch(intent)
	                    {
	                        case "use":
	                            return $"use {entities.First()} with {entities.Last()}";
	
	                        case "give":
	                            return $"give {entities.First()} to {entities.Last()}";
	                        
	                        default:
	                            return $"{intent} {entities.First()}";        
	                    }
	                }
	            }
	
	            return null;
	        }
	
	        #region LUIS result parsing
	
	        private static string GetLUISIntent(LUISModel luisResult)
	        {
	            string intent = null;
	            var topIntent = luisResult.TopIntent();
	            if (topIntent.intent  != LUISModel.Intent.None)
	            {
	                intent = topIntent.intent.ToString().Replace("_", " ");
	            }
	            return intent;
	        }
	
	        private static IEnumerable<string> GetLUISEntities(LUISModel luisResult)
	        {
	            List<string> entities = new List<string>();
	
	            if (luisResult.Entities.GameObject?.Count() > 0)
	            {
	                entities.AddRange(luisResult.Entities.GameObject.Select(o => o[0]).ToList());
	            }
	            if (luisResult.Entities.GameActor?.Count() > 0)
	            {
	                entities.AddRange(luisResult.Entities.GameActor.Select(o => o[0]).ToList());
	            }
	
	            return entities;
	        }
	
	        #endregion
	    }
	}
	```  

3. Examine the code. This method will take the result of a call to your LUIS model, interpret it and turn into a bot command. This is a fairly specific implementation that assumes you're using 2 entities of type list named *GameObject* and *GameActor*.

### Add the LUIS service to the bot
Now you will add the LUIS Service to the Bot. Execute the following steps:

1. Open the `BotServices.cs` file in the root of the project.

2. Replace the line `// TODO Trial 3: Add LUIS service` with the following code-snippet:
	```csharp
	case ServiceTypes.Luis:
	{
	    var luis = (LuisService)service;
	    var app = new LuisApplication(luis.AppId, luis.SubscriptionKey, luis.GetEndpoint());
	    var recognizer = new LuisRecognizer(app);
	    LuisServices.Add(luis.Name, recognizer);
	    break;
	}
	```

### Call LUIS from the bot
Now you will add a call to LUIS to the bot code. This will make sure that all input from the user is sent to LUIS. Execute the following steps:

1. Open the `GameBot.cs` file in the root of the project.

2. Import the *Luis* namespace by adding a using statement: 
	```csharp
	using Luis;.
	```

2. Find the `OnTurnAsync` method. 

3. Replace the line `// TODO Trial 3: Add call to LUIS service` with the following code-snippet:
	```csharp
	// get command from LUIS (if enabled)
	if (_luisOptions.Enabled)
	{
		var recognizerResult = await _services.LuisServices["gameatron4000"]
			.RecognizeAsync<LUISModel>(context, cancellationToken);
		string command  = recognizerResult.ToCommand();
		if (!string.IsNullOrEmpty(command))
		{
			context.Activity.Text = command;
		}
	}
	```

4. Examine the code. You see the check to see whether or not LUIS integration is enabled. After that you see the call to LUIS and the interpretation of the result by calling the `ToCommand` extension-method you created earlier. If this yields a command, we replace the input of the user (*Text*) on the incoming activity. 

### Configure the LUIS connection
Now all the code to integrate LUIS with your bot is in place. Now you will configure LUIS by executing the following steps: 

1. Open the `appSettings.Development.json` file in the root of the project.

2. Enable LUIS by setting the setting `LUIS.Enabled` to `true`:
	```json
	"LUIS": {
 		"Enabled": true
	}
	```

You will now add the LUIS service configuration to to the `gameatron4000.bot` file: 

1. Open a command-prompt and change the current working-folder to the GameATron4000 project root-folder.

2. Issue the following command and supply the values that you saved in step 4. 

```
msbot connect luis --name gameatron4000 --appId <appid> --version 0.1 --authoringKey <authoringkey> --subscriptionKey <authoringkey> --region westus
```

### Test the bot
Now you will test the bot using the Bot Emulator by executing the following steps:

1. Run the bot by pressing `F5` in VS Code.

2. Start the *Microsoft Bot Emulator*.

3. Open a new bot configuration by clicking the `Open bot` button.

4. Select the `GameATron4000.bot` file in the root of the project.

5. You will start in the initial Park room. There's a newspaper on the ground. Try different commands for looking at the newspaper that you used when training the LUIS model. You will see that the bot will call LUIS and interpret the intent and entities correctly:

  ![](img/test-luis.png)
 
6. As you can see in the screen-shot, you're able to see the LUIS call and results in the inspector window in the Bot Emulator.

That's it! I hope you enjoyed enriching your GameATron4000 bot with natural language capabilities by integrating LUIS into it. Obviously this exercise barely scratches the surface of what's possible with LUIS. If you want to know more, check out the Microsoft documentation and video's on this subject available on the Internet.