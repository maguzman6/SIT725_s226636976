## Task 2.2P

For the task, a simple Express Web Server was developed, which can be executed by running `npm run start` inside the `source files` folder.

![Figure 1: npm run start command](./screenshots/fig1.png)

![Figure 2: Main menu](./screenshots/fig2.png)

I add to the web server a main menu in the `index.html` file with the option of selecting two "calculators":
- "Task Calculator": This one includes the square function developed during the workshop and the add function to be developed for this task.

![Figure 3: Task Calculator](./screenshots/fig3.png)

- "Sequential Calculator": A sequential calculator that enables to chain basic operations (add, substract, multiply and divide). The calculator sends the sequence as a string query parameter via a GET request to the server to calculate. Note that it does not support parenthesis, therefore the calculations are done sequentially.

![Figure 4: Sequential Calculator](./screenshots/fig4.png)

![Figure 5: Sequential Calculator Results](./screenshots/fig5.png)

Assumptions:
- The user will input numbers only. If a non-numeric value is entered, the result will be `null`