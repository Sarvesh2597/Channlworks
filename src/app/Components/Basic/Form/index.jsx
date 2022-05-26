import React from "react";
import { Form } from "react-bootstrap";
import { classNames } from "classnames";
import TagsInput from "react-tagsinput";

export const FormInput = ({
	label,
	type = "text",
	name,
	id,
	register,
	placeholder,
	error,
}) => {
	return (
		<Form.Group controlId={id}>
			<Form.Label>{label}</Form.Label>
			<Form.Control {...register(name)} type={type} placeholder={placeholder} />
			{error ? <Form.Label className="text-danger">{error}</Form.Label> : null}
		</Form.Group>
	);
};

export const FormTextArea = ({
	label,
	type = "text",
	rows = "1",
	name,
	id,
	register,
	placeholder,
	error,
	...rest
}) => {
	return (
		<Form.Group controlId={id}>
			<Form.Label>{label}</Form.Label>
			<Form.Control
				{...register(name)}
				as={type}
				placeholder={placeholder}
				rows={rows}
			/>
			{error ? <Form.Label className="text-danger">{error}</Form.Label> : null}
		</Form.Group>
	);
};

export const FormRadio = ({ setValue, value, name, label, def }) => {
	const onChange = () =>
		setValue(name, label === "No" ? false : true, {
			shouldDirty: true,
			shouldValidate: true,
		});
	return (
		<Form.Check
			inline
			type={"radio"}
			name={name}
			label={label}
			checked={value === def}
			onChange={onChange}
		/>
	);
};

export const FormTags = ({ setValue, value, name, label, id, error }) => {
	const handleChange = tags => {
		setValue(name, tags, { shouldValidate: true, shouldDirty: true });
	};
	return (
		<Form.Group controlId={id}>
			<Form.Label>{label} </Form.Label>
			<TagsInput value={value || []} onChange={handleChange} />
			{error ? <Form.Label className="text-danger">{error}</Form.Label> : null}
		</Form.Group>
	);
};

export const FormInputDropDown = ({
	label,
	type = "text",
	name,
	id,
	register,
	placeholder,
	error,
	data,
}) => {
	return (
		<Form.Group controlId={id}>
			<Form.Label>{label}</Form.Label>
			<Form.Control as="select" name={name} {...register(name)}>
				<option selected="true" disabled="disabled">
					{placeholder}
				</option>
				{data.map(d => (
					<option value={d.value}>{d.label}</option>
				))}
			</Form.Control>
			{error ? <Form.Label className="text-danger">{error}</Form.Label> : null}
		</Form.Group>
	);
};
export const FormError = ({ error, id = "form-error" }) => {
	return <p role="alert">{error}</p>;
};

export const FormDisplayContent = ({
	label,
	name,
	formData,
	type = "text",
	placeholder,
}) => {
	return (
		<Form.Group>
			<Form.Label>{label}</Form.Label>
			{formData !== undefined && (
				<Form.Control
					value={formData[name] || ""}
					type={type}
					placeholder={placeholder}
				/>
			)}
		</Form.Group>
	);
};
