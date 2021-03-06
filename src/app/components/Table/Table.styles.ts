export const defaultTableStyle = `
	table {
		margin: 0;
		padding: 0;
		width: 100%;
		border: none;

		thead {
			th.hasBorder:not(:first-child):after {
				content: "";
			    height: 50%;
			    position: absolute;
			    left: 0;
			    top: 25%;
			    border-left-width: 1px;
			    border-color: inherit;
			}
		}
	}
`;
