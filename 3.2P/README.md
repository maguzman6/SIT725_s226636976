For the task, an example as the one showed in the workshop was developed, but in this case it shows coffee images in cards. 

![Figure 1: Home page](./screenshots/fig1.png)

For task purposes the background color was changed, and it was fixed the position of LinkedIn text, and the cards initialize with three fix images and cards in the same position. 

There is a `Add a coffee` button that helps us to add a new card, and works first with a form as follows: 

![Figure 2: Add a coffee](./screenshots/fig2.png)

When the submit button is pressed, then it shows the following alert

![Figure 3: Add a coffee alert](./screenshots/fig3.png)

This function what is does it to call a the submit-form endpoint in the server, that takes this data, fetches a random image from `https://coffee.alexflipnote.dev/random.json` (AlexFlipnote, 2025), and then return this data to the frontend to create a new card using the addCard() function. 

With that, now we have a new card that can be opened as follows. 

![Figure 4: New coffee card](./screenshots/fig4.png)

![Figure 5: New coffee card description](./screenshots/fig5.png)

References: 

- AlexFlipnote. (2025). GitHub - AlexFlipnote/CoffeeAPI: ☕ An API that provides random coffee images. GitHub. https://github.com/alexflipnote/coffeeapi 
