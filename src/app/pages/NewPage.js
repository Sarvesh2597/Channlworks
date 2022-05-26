import React from "react";
import { CustomersCard } from "../modules/ECommerce/pages/customers/CustomersCard";
import { CustomersUIProvider } from "../modules/ECommerce/pages/customers/CustomersUIContext";
export function NewPage({ history }) {

  const customersUIEvents = {
    newCustomerButtonClick: () => {
      history.push("/e-commerce/customers/new");
    },
    openEditCustomerDialog: (id) => {
      history.push(`/e-commerce/customers/${id}/edit`);
    },
    openDeleteCustomerDialog: (id) => {
      history.push(`/e-commerce/customers/${id}/delete`);
    },
    openDeleteCustomersDialog: () => {
      history.push(`/e-commerce/customers/deleteCustomers`);
    },
    openFetchCustomersDialog: () => {
      history.push(`/e-commerce/customers/fetch`);
    },
    openUpdateCustomersStatusDialog: () => {
      history.push("/e-commerce/customers/updateStatus");
    }
  }
  const columns = [
    {
       dataField: "id",
       text: "ID",
       sort: true,
     },
     {
       dataField: "firstName",
       text: "First Name",
       sort: true,
     },
     {
       dataField: "lastName",
       text: "Last Name",
       sort: true,
     }    
    
 ]
 
 const data = [
   {
     id: 1,
     firstName: "GCP Build- G Suite- Premier Level",
     lastName: "Gabotti",
     email: "sgabotti0@wsj.com",
     userName: "sgabotti0",
     gender: "Female",
     status: 0,
     dateOfBbirth: "10/14/1950",
     ipAddress: "251.237.126.210",
     declaration: {
       completed: 5,
        total: 6
     },
     type: 1,
     _userId: 1,
     _createdDate: "09/07/2016",
     _updatedDate: "05/31/2013"
   },
   {
     id: 2,
     firstName: "GCP Service- Google Cloud- Premier Level",
     lastName: "Cowperthwaite",
     email: "acowperthwaite1@storify.com",
     userName: "acowperthwaite1",
     gender: "Male",
     status: 1,
     dateOfBbirth: "12/31/1998",
     ipAddress: "239.176.5.218",
     type: 1,
     declaration: {
       completed: 3,
        total: 3
     },
     _userId: 2,
     _createdDate: "03/18/2014",
     _updatedDate: "08/17/2016"
   },
   {
     id: 3,
     firstName: "AWS Consultancy Competency Program - Storage",
     lastName: "Stodd",
     email: "mstodd2@twitpic.com",
     userName: "mstodd2",
     gender: "Female",
     status: 0,
     dateOfBbirth: "7/3/1957",
     ipAddress: "14.80.25.15",
     declaration: {
       completed: 1,
        total: 3
     },
     type: 1,
     _userId: 1,
     _createdDate: "07/03/2015",
     _updatedDate: "01/28/2015"
   },
   {
     id: 4,
     firstName: "AWS Consultancy Competency Program - Mobile",
     lastName: "Galbreth",
     email: "ngalbreth3@springer.com",
     userName: "ngalbreth3",
     gender: "Female",
     status: 0,
     dateOfBbirth: "12/30/1976",
     ipAddress: "239.198.18.122",
     declaration: {
       completed: 2,
        total: 5
     },
     type: 0,
     _userId: 2,
     _createdDate: "06/22/2013",
     _updatedDate: "01/31/2011"
   },
   {
     id: 5,
     firstName: "GCP Sell- Google Cloud- Premier Level",
     lastName: "Jandl",
     email: "ajandl4@mapy.cz",
     userName: "ajandl4",
     gender: "Female",
     status: 1,
     dateOfBbirth: "11/23/1996",
     ipAddress: "11.19.64.48",
     declaration: {
       completed: 1,
        total: 1
     },
     type: 1,
     _userId: 1,
     _createdDate: "01/30/2018",
     _updatedDate: "05/22/2014"
   },
   {
     id: 6,
     firstName: "Azure MPN Silver Competency- Application Development- Application Builder Option",
     lastName: "Duplan",
     email: "mduplan5@msn.com",
     userName: "mduplan5",
     gender: "Female",
     status: 1,
     dateOfBbirth: "4/21/1954",
     ipAddress: "104.18.128.93",
     declaration: {
       completed: 5,
        total: 5
     },
     type: 1,
     _userId: 1,
     _createdDate: "03/27/2011",
     _updatedDate: "09/02/2015"
   },
   {
     id: 7,
     firstName: "Azure MPN Silver Competency- DevOps- DevOps Partner Option",
     lastName: "Stow",
     email: "dstow6@vistaprint.com",
     userName: "dstow6",
     gender: "Male",
     status: 0,
     dateOfBbirth: "4/14/1998",
     ipAddress: "168.199.143.20",
     declaration: {
       completed: 8,
        total: 10
     },
     type: 1,
     _userId: 1,
     _createdDate: "09/05/2011",
     _updatedDate: "06/21/2012"
   },
   {
     id: 8,
     firstName: "Azure MPN Silver Competency- Machine Learning",
     lastName: "Dering",
     email: "bdering7@europa.eu",
     userName: "bdering7",
     gender: "Male",
     status: 1,
     dateOfBbirth: "8/15/1963",
     ipAddress: "204.7.174.42",
     declaration: {
       completed: 10,
        total: 10
     },
     type: 0,
     _userId: 1,
     _createdDate: "09/09/2017",
     _updatedDate: "06/27/2011"
   },
   {
     id: 9,
     firstName: "Azure MPN Silver Competency- Cloud Platform- Learning Option",
     lastName: "Blackaller",
     email: "wblackaller8@biblegateway.com",
     userName: "wblackaller8",
     gender: "Male",
     status: 0,
     dateOfBbirth: "5/20/1997",
     ipAddress: "12.229.194.195",
     declaration: {
       completed: 5,
        total: 10
     },
     type: 0,
     _userId: 1,
     _createdDate: "07/16/2011",
     _updatedDate: "05/24/2014"
   }
 ]
  return (
  <CustomersUIProvider customersUIEvents={customersUIEvents}>
  <CustomersCard columns={columns} data={data}></CustomersCard>
  </CustomersUIProvider>
  );
}
