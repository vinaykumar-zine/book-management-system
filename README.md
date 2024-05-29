# <center>Setup Guide</center>

### prerequesite: you must have mysql, node install in your machine

create a server directory in your desired location. Go into the directory and open terminal

```
git clone https://github.com/vinaykumar-zine/book-management-system.git
```
Now you have the code!<br/>
Create a .env file in root directory and add the following lines your 
```
DATABASE_URL="mysql://root:<your root password>@localhost:3306/<name of the databse>"
JWT_SECRET=<Your secret key will go here>
PORT = 5000
```
<br/>In order to run the code, run follwing commands!

```
npm install
npm run dev
```

## Now you good to go 