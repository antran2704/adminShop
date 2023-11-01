import { FC, Fragment, memo } from "react";

interface Props {
  children: JSX.Element;
  colHeadTabel: string[];
  message: string | null;
  loading: boolean;
}

const Table: FC<Props> = (props: Props) => {
  return (
    <Fragment>
      <div className="scrollHidden overflow-x-auto">
        <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard rounded-lg border">
          <table className="min-w-full">
            <thead className="bg-[#f4f5f7]">
              <tr>
                {props.colHeadTabel.map((item: string, index: number) => (
                  <th
                    key={index}
                    className="text-sm text-[#707275] text-center font-medium px-6 py-3 border-b border-gray-300 leading-4 tracking-wider"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {!props.loading && <Fragment>{props.children}</Fragment>}
              {props.loading &&
                [...new Array(6)].map((item: undefined, index: number) => (
                  <tr key={index}>
                    {props.colHeadTabel.map((item: string, index: number) => (
                      <td key={index} className="px-6 py-4 whitespace-no-wrap border-b">
                        <div className="skelaton w-[100px] h-5 mx-auto"></div>
                      </td>
                    ))}
                  </tr>
                ))}

              {props.message && (
                <tr>
                  <td
                    colSpan={props.colHeadTabel.length}
                    className="px-6 py-4 whitespace-no-wrap"
                  >
                    <p className="text-lg text-center font-medium text-error">
                      {props.message}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default memo(Table);
