import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";

const Footer = (props) => {
  return (
    <>
    <hr className="rounded"></hr>
 
    <MDBFooter color="red" className="font-small pt-4 mt-4">
      <MDBContainer fluid className="text-center text-md-left">
        <MDBRow>
          <MDBCol md="6">
            <h5 className="title">Canbet</h5>
            <p>
              To help you track your wins
            </p>
          </MDBCol>
          <MDBCol md="6">
            <ul>
              {/* <li className="list-unstyled">
                <a href="#!">About Us</a>
              </li> */}
              <h5 className='title'>Help</h5>
              <li className="list-unstyled">
                <a href="http://localhost:3000/responsible-gambling">Responsible Gambling</a>
              </li>
            </ul>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright: Canbet
        </MDBContainer>
      </div>
    </MDBFooter>
    </>
  );
};

export default Footer;