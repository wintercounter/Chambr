# Chambr
This product is in pre-alpha stage. It doesn't have much documentation and/or support. Use at your own risk.

##The story behind Chambr

I was always searching a better way of **storing/handling different data on the frontend**. Did many experiments about finding better **model layer** for my apps. They always had improvements at certain fields while others failed to achieve some with the chosen architecture.

Then *riot.js* came into my sight. I was playing with it for a while and still using it in production,
but faced again the same issue: *How to correctly interact with models and data?*
I'm still not sure **Chambr** is the right way, but feels so good to use so far.

### The data as the model itself

My main goal was to simply have my **data** and **model API** available with less coding at the view layer.
To achieve this I tried to make my data to become the model (kinda) also.

    let data = SomeChambrObject // [1,2,3]
    data.add(4)  // [1,2,3,4]
    data.moreComplexApiMethod('Thomas', true)
    data.sendWithAjaxToServer().then(function(){
    	console.log(`I'm done!`)
    })

### Observable

I also want to know when my data is updated in any way, because I maybe need to do some rendering. The whole model is an observable with custom events. Also the model data itself is observable, so I know when the data is changed.

For example this is what I had to do with riot (yep, that's all):

    this.data.on('update', this.update)
    
### ShortObject

What I did here is extracting the full model class into somewhat I call ***ShortObject***, so this model:

    class MyModel extends ModelAbstract {
        get total(){
            return this.data.length
        }
        constructor(){
            super(new Arr([1,2]))
        }
        create(){}
        read(){}
        update(){}
        delete(){}
    }

Becomes this ***ShortObject*** through Chambr:

    {
        0      : 1,
        1      : 2,
        total  : 2,
        create : function(){},
        read   : function(){},
        update : function(){},
        delete : function(){}
    }

###How should I iterate through them?
Just as usual. Everything what is not the actual data is non-enumerable.

###Why not having the reference of the *Model Instance* at the view and simply call the method?

1. I already showed that this way our data is the model itself.
2. This requires another chapter in this story.

### Separation from the GUI

Frontend developers *Holy Grail* was always to achieve **60 FPS rendering**.
Correct DOM structure, correct CSS is only the half of this coin. It also matters what is your code doing behind the GUI, because many operations can block your DOM or hang the browsers main thread.
Sending requests, fetching responses, manipulate data, all these may have negative impact on our 60 FPS goal.
I wanted to make the whole client layer as light as possible.
First I was experimenting with **Workers**. I wanted to move every **non-GUI code into Worker**.

### Transporting data between layers

First I created my ***Highway.js*** library. This is a ***Pub/Sub transport layer***. It was supposed to be the *Gateway* between the main thread and the Worker. Since it's first release I've changed my mind and implemented Workers as an adapter only so it can support any kind of transport, just needs a proper adapter.

### Main thread for GUI only

So on the top of **Highway** I've refactored **Chambr**. It wasn't an easy task, I've faced many pitfalls, but finally came across.

At this point *the model lives in the Worker*, on the GUI only the **ShortObject** lives, so the client side stays super-lightweight.

### Always failing

Awesome, works in Chrome, but what about other browsers. Workers are supported IE 10+ and it worked perfectly.
However I've felt into some pitfalls again, for example there is no any permanent storage solution in workers (at least not cross-browser one).
No Local/SessionStorage, no Cookies, no IndexedDB, no WebSQL. Started to think about what should I do. Sync all Storage across Chambr? Store permanent data on the client side and constantly move/update data between every transport? Hell no!!!
Too much overhead. Too much work. Not safe. And of course it's a huge bug factory.

### An even better solution was born

Move it to Node. Yes, Node as my Frontend's Backend :D

- Best permanent storage ever: no limits, not just IndexedDB or localStorage but anything!
- ES6 out of the box (Node 6)
- More lightweight client code.

With this my served frontend code is 98% GUI related only! Nothing more. And with *riot* this have much more fun!
Only the view layer is present at the client. No need for controllers because if you build your application right,
riot-router simply takes care of them. No more MVC or MV* just MV.

### So what Chambr is?

It is a Data storage solution where:

- Your model and data manipulation is separated from your main thread. (You're still able to run everything on the main thread of course).
- Your model can live in any other JavaScript based environment (Worker, Node).
- Your data is alive!
- Helps to make your view much more simple.
- Helps build borders around your codebase (strict model API, developers cannot do magic).

This was the main part I think. Now I will answer some question that may come into your mind.


----------


##Q/A

### Why is this better than Flux and other modern data flow solutions?

Actually, I never said that. **Flux** is a great thing. It helps you to maintain your application in a much cleaner way. You can still take advantage of Flux with Chambr, you can make your application work with one flow direction.

Just one tiny difference (which is my opinion): it is better if my model has it's own state and I handle this where I represent the model data - at a view component. Of course there are states which need to be global(ish), for example showing an indicator every time I'm making an AJAX call, but these cases have their own simple solutions.

### Do you have any proof of concept?
I have, unfortunately it's not public, but I'm working on my new personal site built on Chambr/Node.

### Can I try this in production?
You can, but(!) there are a few tests only, there are some known issues in rare edge cases, and there is no documentation or support. There are lot of work to be done.

### Are you nuts?
In a good sense I am. Why? Tell me where I did wrong, tell me, what is your opinion, maybe you're right and this project is totally useless.

### Do you need help?
Yes, I appreciate any kind of help.

### Do you have example?
Yes. I've made the TodoMVC app with Riot+Chambr: link.
It doesn't fulfill the LocalStorage requirement for the reasons I've mentioned before, it runs in a Worker.
I'm also willing to make more examples and live demos if the community wants.

