import { FC, Fragment, memo } from "react";
import NoResult from "../NoResult";

interface Props {
  children: JSX.Element;
  colHeadTabel: string[];
  message: string | null;
  loading: boolean;
}

const Table: FC<Props> = (props: Props) => {
  const { children, colHeadTabel, message, loading } = props;
  return (
    <Fragment>
      <div className="scrollHidden overflow-x-auto">
        <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard rounded-lg border">
          <table className="min-w-full">
            <thead className="bg-[#f4f5f7]">
              <tr>
                {colHeadTabel.map((item: string, index: number) => (
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
              {!loading && <Fragment>{children}</Fragment>}
              {loading &&
                [...new Array(6)].map((item: undefined, index: number) => (
                  <tr key={index}>
                    {colHeadTabel.map((item: string, index: number) => (
                      <td
                        key={index}
                        className="px-6 py-4 whitespace-no-wrap border-b"
                      >
                        <div className="skelaton w-[100px] h-5 mx-auto"></div>
                      </td>
                    ))}
                  </tr>
                ))}

              {message && (
                <tr>
                  <td
                    colSpan={colHeadTabel.length}
                    className="px-6 py-4 whitespace-no-wrap"
                  >
                    <NoResult title={message} />
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
