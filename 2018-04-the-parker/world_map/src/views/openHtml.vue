
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript">
$(function() {
    $('#button01').click(function() {
        $.ajax({
               type: 'GET',
               url: './../RSS_view/america.html',
               dataType: 'html',
               success: function(data) {
                   $('#sample01').append(data);
               },
               error:function() {
                   alert('問題がありました。');
               }
        });
    });s
});
</script>
