window.fbAsyncInit = function() {
  FB.init({
    appId: '1994676114151885',
    cookie: true,
    xfbml: true,
    version: 'v2.8',
    status: true,
  });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
  if (response.status === 'connected') {
    console.log('Logged in and authenticated');
    setElements(true);
    testApi();
  } else {
    console.log('Not authenticated');
    setElements(false);
  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function testApi() {
  FB.api('/me?fields=name,email,birthday,location,hometown', function(response) {
    if (response && !response.error) {
      //console.log(response);
      buildProfie(response);
    }
  })

  FB.api('/me/feed', function(response) {
    if (response && !response.error) {
      //console.log(response);
      buildFeed(response);
    }
  })
}

function buildProfie(user) {
  let profile =
    `
  <h3>${user.name}</h3>
  <ul class="list-group">
    <li class="list-group-item">User ID: ${user.id}</li>
    <li class="list-group-item">Email: ${user.email}</li>
    <li class="list-group-item">Birthday: ${user.birthday}</li>
    <li class="list-group-item">Location: ${user.location.name}</li>
    <li class="list-group-item">Hometown: ${user.hometown.name}</li>
  </ul>
  `;

  document.getElementById('profile').innerHTML = profile;
}

function buildFeed(feed) {
  let output = '<h3>Latest Posts</h3>';
  for (let i in feed.data) {
    if (feed.data[i].message && feed.data[i].story) {
      output += `
        <div class="well">
          Message: ${feed.data[i].message}
          Story: ${feed.data[i].story}
          When: ${feed.data[i].created_time}
        </div>
      `;
    } else if (feed.data[i].message) {
      output += `
        <div class="well">
          Message: ${feed.data[i].message}
          When: ${feed.data[i].created_time}
        </div>
      `;
    } else if (feed.data[i].story) {
      output += `
        <div class="well">
          Story: ${feed.data[i].story}
          When: ${feed.data[i].created_time}
        </div>
      `;
    }
  }

  document.getElementById('feed').innerHTML = output;
}

function setElements(isLoggedIn) {
  if (isLoggedIn) {
    document.getElementById('logout').style.display = 'block';
    document.getElementById('profile').style.display = 'block';
    document.getElementById('feed').style.display = 'block';
    document.getElementById('fb-btn').style.display = 'none';
    document.getElementById('heading').style.display = 'none';
  } else {
    document.getElementById('logout').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('feed').style.display = 'none';
    document.getElementById('fb-btn').style.display = 'block';
    document.getElementById('heading').style.display = 'block';
  }
}

function logout() {
  FB.logout(function(response) {
    setElements(false);
  });
}
