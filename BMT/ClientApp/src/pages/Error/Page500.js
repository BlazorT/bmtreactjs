/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const Page500 = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-12 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">{/*<h1 className="text-center ">404</h1>*/}</div>
              <div className="contant_box_404">
                <h3 className="h2">Oops! Look like you're lost database connection.</h3>

                {/*<p>the page you are looking for not avaible!</p>*/}

                <a href="" className="link_404">
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page500;
