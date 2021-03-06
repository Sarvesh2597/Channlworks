/* eslint-disable no-restricted-imports */
import React from "react";
import {makeStyles} from "@material-ui/core";
import {Typography, Button, Modal} from "@material-ui/core";
import {Notice, KTCodeExample} from "../../../../_metronic/_partials/controls";

// Example 1
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none"
  }
}));

function SimpleModal() {
  const [open, setOpen] = React.useState(false);
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  return (
    <div>
      <Typography gutterBottom>
        Click to get the full Modal experience!
      </Typography>
      <Button onClick={handleOpen}>Open Modal</Button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <Typography variant="h6" id="modal-title">
            Text in a modal
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <SimpleModal />
        </div>
      </Modal>
    </div>
  );
}

export default function ModalExamplesPage() {
  // Example 1
  const [open, setOpen] = React.useState(false);
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  return (
    <>
      <Notice icon="flaticon-warning font-primary">
        <span>
          The modal component provides a solid foundation for creating dialogs,
          popovers, lightboxes, or whatever else.
        </span>{" "}
        <span>
          For more info please check the components's official{" "}
          <a
            target="_blank"
            className="font-weight-bold"
            rel="noopener noreferrer"
            href="https://material-ui.com/components/modal/"
          >
            demos & documentation
          </a>
        </span>
      </Notice>

      <KTCodeExample jsCode={jsCode1} beforeCodeTitle="Simple modal">
            <div>
              <Typography gutterBottom>
                Click to get the full Modal experience!
              </Typography>
              <Button onClick={handleOpen}>Open Modal</Button>
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
              >
                <div style={modalStyle} className={classes.paper}>
                  <Typography variant="h6" id="modal-title">
                    Text in a modal
                  </Typography>
                  <Typography variant="subtitle1" id="simple-modal-description">
                    Duis mollis, est non commodo luctus, nisi erat porttitor
                    ligula.
                  </Typography>
                  <SimpleModal />
                </div>
              </Modal>
            </div>
      </KTCodeExample>
    </>
  );
}

const jsCode1 = `
import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: \`\${top}%\`,
    left: \`\${left}%\`,
    transform: \`translate(-\${top}%, -\${left}%)\`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
  },
}));

export default function SimpleModal() {
  const [open, setOpen] = React.useState(false);
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  return (
    <div>
      <Typography gutterBottom>Click to get the full Modal experience!</Typography>
      <Button onClick={handleOpen}>Open Modal</Button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <Typography variant="h6" id="modal-title">
            Text in a modal
          </Typography>
          <Typography variant="subtitle1" id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <SimpleModal />
        </div>
      </Modal>
    </div>
  );
}
`;
