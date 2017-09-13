/*********************************************
*                ON DOM READY                *
*********************************************/
$(function() {
    $('.lk-toggle-nav').click(function() {
        toggleNav();
    });
    $('.lk-close').click(function() {
        toggleNav();
    });
});




/*********************************************
*                  FUNCTIONS                 *
*********************************************/
function toggleNav() {
    if($('.lk-wrapper').hasClass('show-nav')) {
        $('.lk-wrapper').removeClass('show-nav');
    }
    else {
        $('.lk-wrapper').addClass('show-nav');
    }
}
