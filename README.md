s3play
======
s3play is a Javascript based website / chrome web app that streams MP3s from your AWS (Amazon Web Services) S3 bucket. It is very much a work in progress.

How to use
======
Go to the AWS management console and select S3 under services. Right click on the bucket you want to use and select properties. Under 'permissions' click on 'edit CORS configuration' and paste the xml block below.

    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        <CORSRule>
            <AllowedOrigin>http://dtkav.github.com</AllowedOrigin>
            <AllowedMethod>GET</AllowedMethod>
            <AllowedHeader>*</AllowedHeader>
            <ExposeHeader>x-amz-server-side-encryption</ExposeHeader>
            <ExposeHeader>x-amz-request-id</ExposeHeader>
            <ExposeHeader>x-amz-id-2</ExposeHeader>
        </CORSRule>
    </CORSConfiguration>
    
CORS stands for Cross-Origin Resource Sharing and allows a page hosted on github to access a page on a different host (in this case s3.amazonaws.com).If you clone this repo, make sure the AllowedOrigin matches your new url.

Next, you can enter your AWS access credentials into the settings tab of the web app and click 'load library'. Your library should load in a few seconds. Finally, click a track and rock out :)
