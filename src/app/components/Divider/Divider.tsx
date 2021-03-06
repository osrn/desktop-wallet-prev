import { styled } from "twin.macro";

import { getStyles } from "./Divider.styles";

export type DividerTypeProperties = "horizontal" | "vertical";
export type DividerSizeProperties = "sm" | "md" | "lg";

interface DividerProperties {
	type?: DividerTypeProperties;
	size?: DividerSizeProperties;
	dashed?: boolean;
	className?: string;
}
export type DividerStylesProperties = Omit<DividerProperties, "className">;

export const Divider = styled.div.attrs<DividerProperties>(({ className, type }) => ({
	className: className ? undefined : "border-theme-secondary-300 dark:border-theme-secondary-800",
	type: type ?? "horizontal",
}))<DividerStylesProperties>(getStyles);
