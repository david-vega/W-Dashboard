$(function() {
  var environments = ['production', 'alpha', 'beta', 'preprod'];
  var services = ['bizshield-service', 'email-service'];
  var columns = 12;
  var columnsSize = columns / environments.length;

  services.forEach(function(service){
    $('body').append('<div class="mdl-grid" id="'+ service +'"></div>')
    environments.forEach(function(environment) {
      var htmlTemplate = showInformation(service, environment, columnsSize);
      $('#'+ service).append(htmlTemplate);

      renderHealthCheck(service, environment);
      renderGitInformation(service, environment);
      renderContainerInformation(service, environment);
    });
  });
});

function showInformation(service, environment, columnsSize){
  return `
    <div class="mdl-card mdl-cell mdl-cell--`+ columnsSize +`-col" id="`+ service +'-'+ environment +`">
      <div class="mdl-card__title status-no-info">
        <h2 class="mdl-card__title-text" id="status-title"></h2>
        <span class="service">`+ service +' '+ environment +`</span>
      </div>
      <div class="github-information">
        <div class="mdl-card__supporting-text">
          <img alt="" class="avatar" src="">
          <ul class="mdl-list">
            <li class="mdl-list__item email">
              <span class="mdl-list__item-primary-content">
              </span>
            </li>
            <li class="mdl-list__item git-sha">
              <span class="mdl-list__item-primary-content">
                <a class="commit-tease-sha" href="" target="blank">
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="mdl-grid container-information">
        <div class="mdl-card__supporting-text">
          <ul class="mdl-list">
            <li class="mdl-list__item cpu">
              <span class="mdl-list__item-primary-content">
              </span>
            </li>
            <li class="mdl-list__item memory">
              <span class="mdl-list__item-primary-content">
              </span>
            </li>
            <li class="mdl-list__item instances">
              <span class="mdl-list__item-primary-content">
              </span>
            </li>
            <li class="mdl-list__item disk">
              <span class="mdl-list__item-primary-content">
              </span>
            </li>
          </ul>
        </div>
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
      var status = data.status || 'Something went wrong';
      handleStatusResponse(status, service, environment);
    },
    error: function (data) {
      var status = data.status || 'Something went wrong';
      handleStatusResponse(status, service, environment);
    }
  });
};

function handleStatusResponse(status, service, environment){
  var id = '#'+ service +'-'+ environment +' .mdl-card__title';

  $(id +' h2').text("Status: "+ status);
  $(id).removeClass('status-down').removeClass('status-up').removeClass('status-no-info');

  var newStatus = status == 200 && 'status-up' || 'status-down';
  $(id).addClass(newStatus);
};

function renderGitInformation(service, environment){
  var email =  "zetacu@gmail.com";
  var revisionNumber = "035e8a8693851d276cba9e2e96939717c5549994";

  handleGitResponse(email, revisionNumber, service, environment);
};

function handleGitResponse(email, revisionNumber, service, environment){
  var id = '#'+ service +'-'+ environment + ' .github-information';

  $(id + ' img')
    .attr('src', 'https://www.gravatar.com/avatar/'+ md5(email))
    .attr('alt', email);

  $(id + ' .email span').text(email);

  var href = 'https://github.com/OtoAnalytics/'+ service +'/commit/'+ revisionNumber;
  $(id + ' .git-sha a')
    .text('ref: '+ revisionNumber.substring(0, 7))
    .attr('href', href);
};

function renderContainerInformation(service, environment){
  var instances = 2;
  var cpu = 20;
  var memory = 30;
  var disk = 50;

  handleContainerResponse(instances, memory, cpu, disk, service, environment);
};

function handleContainerResponse(instances, memory, cpu, disk, service, environment){
  var id = '#'+ service +'-'+ environment + ' .container-information';

  $(id +' .cpu span').text('cpu: '+ cpu +'%')
  $(id +' .memory span').text('memory: '+ memory +'%')
  $(id +' .disk span').text('disk: '+ disk +'%')
  $(id +' .instances span').text('instances: '+ instances)
};
