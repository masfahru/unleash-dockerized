const fs = require('fs');
const systeminformation = require('systeminformation');

// login to the app using fetch and store the session cookie
let token = null;
let cookies = null;

fetch('http://localhost:4242/auth/simple/login', {
  method: 'POST', headers: {
    'Content-Type': 'application/json',
  }, body: JSON.stringify({
    username: "admin", password: "unleash4all"
  }),
}).then(async (response) => {
  if (response.ok) {
    console.log('Login successful');
    cookies = response.headers.get('set-cookie');
    // create an api token for frontend
    await fetch('http://localhost:4242/api/admin/api-tokens', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      }, body: JSON.stringify({
        "type": "frontend", "tokenName": "token-frontend", "project": "default", "environment": "production"
      }),
    }).then(async (response) => {
      if (response.ok) {
        console.log('Token created');
        await response.json().then((data) => {
          token = data.secret;
          console.log('Token:', token);
          // modify file bench.sh, replace token after the export AUTH_TOKEN= with the actual token
          fs.readFile('bench.sh', 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading file:', err);
            } else {
              const updatedData = data.replace(/(export AUTH_TOKEN=).*/, `$1${token}`);
              fs.writeFile('bench.sh', updatedData, 'utf8', (err) => {
                if (err) {
                  console.error('Error writing file:', err);
                } else {
                  console.log('Token updated in bench.sh');
                }
              });
            }
          });
        });
      } else {
        console.error('Token creation failed', await response.text());
      }
    })
    if (token) {
      // create 50 feature flags
      const featureFlags = Array.from({length: 50}, (_, i) => fetch('http://localhost:4242/api/admin/projects/default/features', {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        }, body: JSON.stringify({
          name: `switch-comment-${i + 1}`,
          type: "kill-switch",
          description: "Controls disabling of the comments section in case of an incident",
          impressionData: false
        }),
      }).then(async (response) => {
        if (!response.ok) {
          console.error('Feature flag creation failed', await response.text());
        }})
      );

      await Promise.all(featureFlags).then(() => {
        console.log('Feature flags created');
      }).catch((error) => {
        console.error('Feature flags creation failed', error);
      });

      const features = Array.from({length: 50}, (_, i) => `switch-comment-${i + 1}`);

      // enable all feature flags
      await fetch('http://localhost:4242/api/admin/projects/default/bulk_features/environments/production/on', {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies,
        }, body: JSON.stringify({
          features
        }),
      }).then(async (response) => {
        if (response.ok) {
          console.log('Feature flags enabled');
        } else {
          console.error('Feature flags enabling failed', await response.text());
        }
      }).catch((error) => {
        console.error('Feature flags enabling failed', error);
      });

      await systeminformation.cpu().then(({ flags, cache, ...rest }) => {
        const rows = Object.entries(rest).map(([key, value]) => `${key}: ${value}`);

        const tableString = rows.join('\n');

        fs.writeFile('bench-cpu-info.txt', tableString, 'utf8', (err) => {
          if (err) {
            console.error('Error writing file:', err);
          } else {
            console.log('CPU info written to bench-result-cpu-info.txt');
          }
        });
      });
    }
  } else {
    console.error('Login failed', await response.text());
  }
}).catch((error) => {
  console.error('Login failed', error);
}).finally(() => {
  console.log('Setup completed');
  process.exit();
});
