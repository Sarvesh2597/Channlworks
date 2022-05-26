/* eslint-disable no-func-assign */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-imports */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Snackbar, IconButton, SnackbarContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import { amber, green } from "@material-ui/core/colors";

// Example 2
const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const useStyles21 = makeStyles(theme => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: "#f67b88",
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	message: {
		display: "flex",
		alignItems: "center",
		fontSize: "1rem",
	},
}));

function MySnackbarContentWrapper2(props) {
	const classes = useStyles21();
	const { className, message, onClose, variant, ...other } = props;
	const Icon = variantIcon[variant];

	return (
		<SnackbarContent
			className={clsx(classes[variant], className)}
			aria-describedby="client-snackbar"
			message={
				<span id="client-snackbar" className={classes.message}>
					<Icon className={clsx(classes.icon, classes.iconVariant)} />
					{message}
				</span>
			}
			action={[
				<IconButton
					key="close"
					aria-label="Close"
					color="inherit"
					onClick={onClose}
				>
					<CloseIcon className={classes.icon} />
				</IconButton>,
			]}
			{...other}
		/>
	);
}

MySnackbarContentWrapper2.propTypes = {
	className: PropTypes.string,
	message: PropTypes.node,
	onClose: PropTypes.func,
	variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired,
};

export default function SnackbarComp({
	open,
	message,
	onClose,
	variant = "success",
}) {
	const [open2, setOpen2] = React.useState(false);

	function handleClose2(event, reason) {
		if (reason === "clickaway") {
			return;
		}
		onClose();
		setOpen2(false);
	}

	useEffect(() => {
		console.log("here");
		setOpen2(open);
	}, [open, message]);

	return (
		<>
			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={open2}
				autoHideDuration={3000}
				onClose={handleClose2}
			>
				<MySnackbarContentWrapper2
					onClose={handleClose2}
					variant={variant}
					message={message}
				/>
			</Snackbar>
		</>
	);
}
