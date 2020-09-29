const { head } = require("../../routes/admin/auth")

module.exports = ({ content }) => {
    return `
    <!DOCTYPE html>
    <html>
        <head>
        </head>
        <body>
            ${content} 
        </body>
    </html>
     `;
};