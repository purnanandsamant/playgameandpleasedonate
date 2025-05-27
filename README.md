# Math for a Cause - School Fundraising Game

A fun, educational math game designed to encourage donations for school fundraising. Players solve math problems to earn points, with the game gently encouraging donations at key milestones.

## Features

- **Engaging Math Game**: Addition, subtraction, multiplication, and division problems
- **Progressive Difficulty**: Questions get harder as players score more points
- **Visual Progress**: Watch the school grow and improve as you play
- **Milestones**: Unlock achievements as you reach point thresholds
- **Donation Integration**: Encourages donations at strategic points
- **Responsive Design**: Works on desktop and mobile devices
- **No Backend Needed**: Runs entirely in the browser

## How to Deploy

### Option 1: Deploy to GitHub Pages (Recommended)

1. Create a new GitHub repository
2. Upload all the files (index.html, style.css, game.js, README.md)
3. Go to Settings > Pages
4. Under "Source", select the `main` branch and click "Save"
5. Your game will be live at `https://[your-username].github.io/[repository-name]/`

### Option 2: Deploy to Any Web Host

1. Upload all the files to your web hosting service
2. Ensure the files maintain their relative paths
3. Access the game through your domain

## Customization

### Update Donation Link

1. Open `index.html` in a text editor
2. Find the line with `YOUR_DONATION_LINK_HERE`
3. Replace it with your actual donation link

### Customize School Goals

1. Open `game.js` in a text editor
2. Find the `milestones` array (around line 26)
3. Edit the points, text, and emojis to match your school's goals

### Change Colors and Styling

1. Open `style.css` in a text editor
2. Update the color variables at the top of the file:
   ```css
   :root {
       --primary-color: #4a6fa5;
       --secondary-color: #ffd166;
       --accent-color: #ef476f;
       --light-color: #f8f9fa;
       --dark-color: #212529;
       --success-color: #06d6a0;
   }
   ```

## How It Works

1. Players click "Start Game" to begin
2. They solve math problems to earn points
3. The school visual grows and improves with their score
4. At certain score thresholds, a donation prompt appears
5. Players can continue playing or click to donate
6. High scores are saved in the browser's local storage

## Features to Add (Optional)

- Leaderboard using a simple backend
- More complex math problems
- Different school themes
- Social sharing options

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue in the GitHub repository.
