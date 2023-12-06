import React from "react";

function Footer() {
    return (
        <footer className="footer" style={{width:'100%'}}>
        <div className="footer__container">
            <div className="footer__text" style={{display: 'flex', justifyContent:'space-between'}}>
            <a href="https://github.com/ejeonghun" style={{textDecoration:'none'}}><p style={{margin:'2px', color:'black'}}>Luna</p></a>
            </div>
        </div>
        </footer>
    );
    }

export default Footer;