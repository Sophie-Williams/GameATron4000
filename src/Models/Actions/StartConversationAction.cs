using System.Collections.Generic;
using GameATron4000.Models;
using Microsoft.Bot.Builder.Core.Extensions;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Threading.Tasks;

namespace GameATron4000.Models.Actions
{
    public class StartConversationAction : CommandAction
    {
        public const string Name = "StartConversation";

        [JsonConstructor]
        private StartConversationAction()
        {
        }

        public StartConversationAction(List<string> args, Precondition[] preconditions)
            : base(preconditions)
        {
            ConversationId = args[0];
        }

        [JsonProperty]
        public string ConversationId { get; private set; }

        public override CommandActionResult Execute(DialogContext dc, IList<IActivity> activities, IDictionary<string, object> state)
        {
            return CommandActionResult.StartConversation(ConversationId);
        }
    }
}