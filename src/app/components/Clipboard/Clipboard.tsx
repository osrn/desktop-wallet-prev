import React from "react";

import { ClipboardProperties } from "./Clipboard.contracts";
import { ClipboardButton } from "./ClipboardButton";
import { ClipboardIcon } from "./ClipboardIcon";

const defaultProps = {
	options: {},
};

export const Clipboard: React.VFC<ClipboardProperties> = ({ options = defaultProps.options, ...properties }) => {
	if (!properties.children) {
		return <></>;
	}

	if (properties.variant === "icon") {
		return (
			<ClipboardIcon options={options} {...properties}>
				{properties.children}
			</ClipboardIcon>
		);
	}

	return (
		<ClipboardButton options={options} {...properties}>
			{properties.children}
		</ClipboardButton>
	);
};
