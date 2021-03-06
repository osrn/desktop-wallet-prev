import React from "react";

import { ListDividedItemProperties } from "./ListDivided.contracts";

export const ListDividedItem: React.VFC<ListDividedItemProperties> = ({
	isFloatingLabel,
	label,
	labelClass,
	labelDescription,
	labelDescriptionClass,
	labelAddon,
	value,
	itemValueClass,
	content,
	contentClass,
	wrapperClass,
}) => (
	<li className={`flex flex-col w-full ${wrapperClass || ""}`} data-testid="list-divided-item__wrapper">
		<div
			className={`flex justify-between ${isFloatingLabel ? "flex-col items-start" : "items-center"}`}
			data-testid="list-divided-item__inner-wrapper"
		>
			<div className="flex flex-col space-y-2 w-full">
				<div className="flex justify-between items-center space-x-5">
					<span
						className={labelClass || "font-semibold text-theme-secondary-700 dark:text-theme-secondary-200"}
						data-testid="list-divided-item__label"
					>
						{label}
					</span>
					{labelAddon && <span>{labelAddon}</span>}
				</div>
				{labelDescription && (
					<span
						className={
							labelDescriptionClass ||
							"text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-700"
						}
						data-testid="list-divided-item__label--description"
					>
						{labelDescription}
					</span>
				)}
			</div>
			{value && (
				<div className={itemValueClass}>
					<span data-testid="list-divided-item__value">{value}</span>
				</div>
			)}
		</div>
		{content && (
			<div className={contentClass || ""} data-testid="list-divided-item__content">
				{content}
			</div>
		)}
	</li>
);
