$(function() {
  var environments = ['production', 'alpha', 'beta', 'preprod']
  var services = ['bizshield-service', 'email-service']
  var columns = 12
  var columnsSize = columns / environments.length

  services.forEach(function(service){
    $('body').append('<div class="mdl-grid" id="'+ service +'"></div>')
    environments.forEach(function(environment) {
      var htmlTemplate = showInformation(service, environment, columnsSize)
      $('#'+ service).append(htmlTemplate);

      renderHealthCheck(service, environment);
    });
  });
});

function showInformation(service, environment, columnsSize){
  var githubInformation = fetchGithubInformation(service, environment);
  var containerInformation = fetchContainerInformation(service, environment);

  return `
    <div class="mdl-card mdl-cell mdl-cell--`+ columnsSize +`-col" id="`+ service +'-'+ environment +`">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text" id="status-title"></h2>
        <span>`+ service +' '+ environment +`</span>
      </div>
      <div class="github-information">
        <div class="mdl-card__supporting-text">
          <img alt="`+ githubInformation.userName +`" class="avatar" src="`+ githubInformation.photoSource +`">
          <ul class="github-information mdl-list">
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                `+ githubInformation.userName+`
              </span>
            </li>
            <li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">
                <a class="commit-tease-sha" href="https://github.com/OtoAnalytics/`+ service +`/commit/`+ githubInformation.revisionNumber +`" target="blank">
                  `+ githubInformation.revisionNumber.substring(0, 7) +`
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="mdl-grid container-information">
      </div>
    </div>
  `;
};

function renderHealthCheck(service, environment){
  $.ajax({
    url: "http://svc27.preprod/health",
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    contentType: 'application/json',
    success: function (data) {
      console.log('success')
      var status = data.status || 'Something went wrong'
      handleStatusResponse(status, service, environment)
    },
    error: function (data) {
      console.log('error')
      var status = data.status || 'Something went wrong'
      handleStatusResponse(status, service, environment)
    }
  });
};

function handleStatusResponse(status, service, environment){
  $('#'+ service +'-'+ environment +' h2').text("Status: "+ status)
};

function fetchGithubInformation(service, environment){
  var userName =  "@david-vega";
  var photoSource = "https://avatars3.githubusercontent.com/u/1914931?v=3&amp;s=80"
  var revisionNumber = "fe1ac36c1886e87d23079a89403822aea6d559a6"

  return { userName: userName, photoSource: photoSource, revisionNumber: revisionNumber }
};

function fetchContainerInformation(service, environment){
  var instances = 2;
  var cpu = 20;
  var memory = 30;
  var disk = 50;

  return { instances: instances, memory: memory, cpu: cpu, disk: disk }
};
