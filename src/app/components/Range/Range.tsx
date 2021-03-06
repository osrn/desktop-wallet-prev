import React, { useLayoutEffect, useState } from "react";
import { getTrackBackground, Range as ReactRange } from "react-range";
import tw, { styled } from "twin.macro";

const Track = styled.div`
	height: 1px;
	${tw`flex w-full rounded`}
`;

const TrackFilled = styled.div`
	${tw`p-0 border-0 h-1 w-full rounded self-center`}
`;

const Thumb = styled.div`
	&:active {
		${tw`bg-theme-primary-600`}
	}
	${tw`m-0 transition-colors duration-100 w-4 h-4 rounded-full bg-theme-background border-3 border-theme-primary-600 focus:outline-none focus:shadow-outline`}
`;

interface Properties {
	values: number[];
	onChange: (values: number[]) => void;
	min: number;
	max: number;
	step: number;
	isInvalid?: boolean;
}

export const Range = ({ values, min = 1, max = 100, step = 1, onChange, isInvalid }: Properties) => {
	const color = isInvalid ? "var(--theme-color-danger-700)" : "var(--theme-color-primary-600)";

	/*
	 * Ensure at least one value on mount to properly render the thumb
	 * as the `react-range` package does not watch changes in `values` to recalculate offsets
	 */
	const [rangeValues, setRangeValues] = useState([min]);

	useLayoutEffect(() => {
		setRangeValues(values);
	}, [values]);

	return (
		<div data-testid="Range" className="flex flex-wrap justify-center">
			<ReactRange
				values={rangeValues}
				step={step}
				min={min}
				max={max}
				onChange={onChange}
				renderTrack={({ props: track, children }) => (
					<Track
						data-testid="Range__track"
						onMouseDown={track.onMouseDown}
						onTouchStart={track.onTouchStart}
						style={track.style}
					>
						<TrackFilled
							data-testid="Range__track__filled"
							style={{
								background: getTrackBackground({
									colors: [color, "transparent"],
									max,
									min,
									values,
								}),
							}}
							ref={track.ref}
						>
							{children}
						</TrackFilled>
					</Track>
				)}
				renderThumb={({ props: thumb }) => (
					<Thumb data-testid="Range__thumb" {...thumb} style={{ ...thumb.style, borderColor: color }} />
				)}
			/>
		</div>
	);
};
