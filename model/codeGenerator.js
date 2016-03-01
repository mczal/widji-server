function generateUniqueCode(){
    var text = "";
    var possible = "QWERTYUIOPasdfghjklZXCVbnm,{:.]?}+_)(1234567890)}";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
