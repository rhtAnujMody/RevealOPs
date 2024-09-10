export default function Dashboard() {
  return <>
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#111517] tracking-light text-[32px] font-bold leading-tight">Employee Management</p>
                <p className="text-[#647987] text-sm font-normal leading-normal">Manage all employees and their details</p>
              </div>
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div
                    className="text-[#647987] flex border-none bg-[#f0f3f4] items-center justify-center pl-4 rounded-l-xl border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search by name or email"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] focus:outline-0 focus:ring-0 border-none bg-[#f0f3f4] focus:border-none h-full placeholder:text-[#647987] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value=""
                  />
                </div>
              </label>
            </div>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-xl border border-[#dce1e5] bg-white">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-white">
                      <th className="table-06666014-57a5-4e21-8075-96328b6580d0-column-120 px-4 py-3 text-left text-[#111517] w-[400px] text-sm font-medium leading-normal">Name</th>
                      <th className="table-06666014-57a5-4e21-8075-96328b6580d0-column-240 px-4 py-3 text-left text-[#111517] w-[400px] text-sm font-medium leading-normal">Role</th>
                      <th className="table-06666014-57a5-4e21-8075-96328b6580d0-column-360 px-4 py-3 text-left text-[#111517] w-[400px] text-sm font-medium leading-normal">
                        Location
                      </th>
                      <th className="table-06666014-57a5-4e21-8075-96328b6580d0-column-480 px-4 py-3 text-left text-[#111517] w-[400px] text-sm font-medium leading-normal">Email</th>
                      <th className="table-06666014-57a5-4e21-8075-96328b6580d0-column-600 px-4 py-3 text-left text-[#111517] w-[400px] text-sm font-medium leading-normal">
                        Hire Date
                      </th>
                      <th className="table-06666014-57a5-4e21-8075-96328b6580d0-column-720 px-4 py-3 text-left text-[#111517] w-60 text-[#647987] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#dce1e5]">
                      <td className="table-06666014-57a5-4e21-8075-96328b6580d0-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111517] text-sm font-normal leading-normal">
                        Amy Johnson
                      </td>
                      <td className="table-06666014-57a5-4e21-8075-96328b6580d0-column-240 h-[72px] px-4 py-2 w-[400px] text-[#647987] text-sm font-normal leading-normal">
                        Product Designer
                      </td>
                      <td className="table-06666014-57a5-4e21-8075-96328b6580d0-column-360 h-[72px] px-4 py-2 w-[400px] text-[#647987] text-sm font-normal leading-normal">
                        San Francisco, CA
                      </td>
                      <td className="table-06666014-57a5-4e21-8075-96328b6580d0-column-480 h-[72px] px-4 py-2 w-[400px] text-[#647987] text-sm font-normal leading-normal">
                        amy@company.com
                      </td>
                      <td className="table-06666014-57a5-4e21-8075-96328b6580d0-column-600 h-[72px] px-4 py-2 w-[400px] text-[#647987] text-sm font-normal leading-normal">
                        Jan 1, 2021
                      </td>
                      <td className="table-06666014-57a5-4e21-8075-96328b6580d0-column-720 h-[72px] px-4 py-2 w-60 text-[#647987] text-sm font-bold leading-normal tracking-[0.015em]">
                        View / Edit
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* <style>
                          @container(max-width:120px){.table-06666014-57a5-4e21-8075-96328b6580d0-column-120{display: none;}}
                          @container(max-width:240px){.table-06666014-57a5-4e21-8075-96328b6580d0-column-240{display: none;}}
                          @container(max-width:360px){.table-06666014-57a5-4e21-8075-96328b6580d0-column-360{display: none;}}
                          @container(max-width:480px){.table-06666014-57a5-4e21-8075-96328b6580d0-column-480{display: none;}}
                          @container(max-width:600px){.table-06666014-57a5-4e21-8075-96328b6580d0-column-600{display: none;}}
                          @container(max-width:720px){.table-06666014-57a5-4e21-8075-96328b6580d0-column-720{display: none;}}
              </style> */}
            </div>
            <div className="flex items-center justify-center p-4">
              <a href="#" className="flex size-10 items-center justify-center">
                <div className="text-[#111517]" data-icon="CaretLeft" data-size="18px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </div>
              </a>
              <a className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-[#111517] rounded-full bg-[#f0f3f4]" href="#">1</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111517] rounded-full" href="#">2</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111517] rounded-full" href="#">3</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111517] rounded-full" href="#">4</a>
              <a className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111517] rounded-full" href="#">5</a>
              <a href="#" className="flex size-10 items-center justify-center">
                <div className="text-[#111517]" data-icon="CaretRight" data-size="18px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>
  </>;
}
