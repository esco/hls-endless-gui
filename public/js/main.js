$(function(){
  var host = window.location.host;
  var streamUrl = host + '/master.m3u8';
  var $control = $('#control');
  var $action = $('#action');
  var $url = $('#url');
  var $loader = $('#loader');
  var loading = false;

  $control.on('click', flip);

  function flip() {
    get('/switch').success(function(state){
      setControlStyle(state);
    });
  }

  function status() {
    get('/switch/status').success(function(state){
      setControlStyle(state);
    });
  }

  function get(url) {
    if (loading) return;
    loading = true;
    preload();
    return $.get(url).always(function(){
      loading = false;
    });
  }

  function preload() {
    $control
      .removeClass('btn-danger')
      .removeClass('btn-success');
    $loader.removeClass('hidden');
  }

  function setControlStyle(state) {
    state = parseInt(state);
    $control.addClass('btn-' + (!state ? 'success': 'danger'));
    $action.html( !state ? 'Start' : 'Stop' );
    $url.val( state ? streamUrl : 'No Live Stream Running' );
    $loader.addClass('hidden');
  }

  setControlStyle(initialState);
});