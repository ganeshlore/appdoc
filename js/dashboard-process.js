(function(window){
////// this code for proccess timeline  //////
var inputs = $('.input');
var paras = $('.description-flex-container').find('p');
$(inputs).click(function(){
  var t = $(this),
      ind = t.index(),
      matchedPara = $(paras).eq(ind);

  ///  after click input show which step is active  ///
  var activeStep = $(t).children('span').attr('data-step');
  $("#active-step").html(activeStep);
  ///////////////////////////////////////////////////////
  
  $(t).add(matchedPara).addClass('active');
  $(inputs).not(t).add($(paras).not(matchedPara)).removeClass('active');
});
/////////////////////////////////////////////
})(window);