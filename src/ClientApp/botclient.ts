/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
/// <reference path="../node_modules/rx/ts/rx.d.ts" />

import { Action } from "./action"
import { DirectLine } from "botframework-directlinejs";
import "../node_modules/rxjs/add/operator/concatMap";

declare var gameInfo: any;

export class BotClient {

    private directLine: DirectLine;
    private conversationId: string;

    constructor() {

        this.directLine = new DirectLine({
            secret: gameInfo.directLineSecret
        });
    }

    public connect(onMessage: Function, onEvent: Function) {

        console.log("Connecting to 🤖 ...")

        this.directLine.activity$
            .filter(activity => (activity.type === "message" || activity.type === "event") && activity.from.id === gameInfo.botId)
            .concatMap(async x => {

                var activity = <any>x;

                if (!this.conversationId) {
                    this.conversationId = activity.conversation.id;
                    console.log("Connected to 🤖")
                }

                console.log("🤖 " + activity.type + (activity.name ? ": " + activity.name : "") + " >> ");
                console.log(activity);
                
                if (activity.type == "message")
                {
                    await onMessage(activity);
                }
                else if (activity.type == "event")
                {
                    await onEvent(activity);
                }
            })
            .subscribe();
    }

    public async sendActionToBot(action: Action) {

        var text = action.getDisplayText();

        await this.sendMessageToBot(text);
    }

    public async sendMessageToBot(text: string) {
        
        console.log("👩‍💻 " + text);

        this.directLine.postActivity({
            from: { id: this.conversationId },
            type: "message",
            text: text
        })        
        .subscribe();
    }
}