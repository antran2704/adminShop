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
                    className="text-[#707275] text-center font-medium px-6 py-3 border-b border-gray-300 leading-4 tracking-wider"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {!props.loading && <Fragment>{props.children}</Fragment>}
              {props.loading && (
                <>
                  <tr>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton w-[100px] h-5"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton block w-[160px] h-[100px] rounded overflow-hidden"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <span className="skelaton block w-[100px] h-5"></span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b font-medium border-gray-500 text-blue-900 text-sm leading-5">
                      <p className="skelaton w-[100px] h-5"></p>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <div className="flex items-center justify-center">
                        <div className="skelaton w-10 h-5 rounded"></div>
                        <div className="skelaton w-10 h-5 rounded"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton w-[100px] h-5"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton block w-[160px] h-[100px] rounded overflow-hidden"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <span className="skelaton block w-[100px] h-5"></span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b font-medium border-gray-500 text-blue-900 text-sm leading-5">
                      <p className="skelaton w-[100px] h-5"></p>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <div className="flex items-center justify-center">
                        <div className="skelaton w-10 h-5 rounded"></div>
                        <div className="skelaton w-10 h-5 rounded"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton w-[100px] h-5"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="skelaton block w-[160px] h-[100px] rounded overflow-hidden"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <span className="skelaton block w-[100px] h-5"></span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b font-medium border-gray-500 text-blue-900 text-sm leading-5">
                      <p className="skelaton w-[100px] h-5"></p>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <div className="flex items-center justify-center">
                        <div className="skelaton w-10 h-5 rounded"></div>
                        <div className="skelaton w-10 h-5 rounded"></div>
                      </div>
                    </td>
                  </tr>
                </>
              )}

              {props.message && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 whitespace-no-wrap border-b border-gray-500"
                  >
                    <p className="text-xl text-center font-medium text-error">
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
