<img src="./my-app/static/img/mickeyfavicon.png" width="25%" max-height="100px">

# Disney Incident Matcher
Welcome to my repository of Disney Incident Matcher. This is a datavisualisation build in a 6 week study program in the third year of the bachelor Communication and Multimedia Design (CMD) at HvA.

## What is the Disney Incident Matcher?
The incident matcher is an application whereby people who are in for a laugh can match the type of incident they are most likely to overcome when attending to Disney/Universal studios Orlando, Florida.

The incident matcher contains a form where users can fill in their gender and age and receive the incident that is most likely to happen to them.

In addition, the matcher contains a treemap that shows all the incidenttypes that can happen to a selected age group. The age group is calculated by the input of the users form by adding a decrease and increase of 5 years to the input age. Later on, the user can modify this agegroup with a slider.

The leaves on the treemap can be selected, when users do this, the dividens of genders will appear on that incidenttype.

The application is build for desktop screens. However the treemap adapts his size to the widht of the screen. when the screen is smaller than 500px, the treemap increases in length.


## Build with...
* git
* Sveltekit
* d3.js
* scss
* deployment: vercel

## CSV to Json converter
This application also includes a file called "csvToJsonConverter.js". This file converts csv files to json and also makes it possible to customize personal preferences, such as editing the keys, date formats and splitting one key value into two.

## Installation guide
### Node
Install node.js
```bash
-- node install
```
or check if it is installed already by running the following code
```bash
-- node version
```

### Clone repository
Clone repository by this link: https://github.com/Juul03/ID-tech-track-23-24 with the following command:
```bash
-- git clone https://github.com/Juul03/ID-tech-track-23-24.git
```

After that, run
```bash
-- npm install
```
to install all the dependencies 

Check if it works by running the application
```
npm run dev
```

Open the link provided in the terminal for your localhost and you should be able to see the application.

### Running the converter
If you want to run the csv to Json converter, run the following command in the terminal

```bash
node scripts/csvToJsonConverter.js
```

### How it should look like
![image](https://github.com/Juul03/ID-tech-track-23-24/assets/118166691/a0524100-e78e-49d2-873f-bbca37bdbae5)
![image](https://github.com/Juul03/ID-tech-track-23-24/assets/118166691/39159636-eb7d-4f05-a7ca-5234ea1ab6d3)

## License
2023 Julia Hoek MIT

