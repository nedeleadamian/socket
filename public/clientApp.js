(function ($) {
    $(function () {
        const socket = io.connect('http://localhost:3000', {
            reconnectionDelayMax: 10000,
            query: {
                "token": "test5",
                "id": "123"
            }
        });
        socket.on('connect', function (data) {
            var userName;
            var userConfirm;
            do {
                userName = prompt('Please enter your user name');
                userConfirm = confirm('Click "ok" to confirm your username: ' + userName);
                if (userConfirm) {
                    socket.emit('join', userName);
                }
            } while (!userConfirm);
        });
        //Form submit
        $('form').submit(function () {
            socket.emit('message', $('#message').val());
            $('#message').val('');
            return false;
        });
        //Display chats
        socket.on('message', function ({ userName, args }) {
            if (args?.onlyMessage) {
                $('#chat-body').append($('<li>').text(`${args?.message}`));
            } else {
                $('#chat-body').append($('<li>').text(`${userName} : ${args?.message}`));
            }
            $('html, body').animate({
                scrollTop: $(document).height()
            });
        });
        //Display users that join
        socket.on('join', function (data) {
            $('#chat-body').append($('<li>').text(data));
            $('html, body').animate({
                scrollTop: $(document).height()
            });
        });
    });
})(jQuery);
