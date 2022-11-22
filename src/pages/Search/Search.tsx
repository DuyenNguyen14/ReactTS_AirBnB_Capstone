import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import LocationCard from "../../components/Card/LocationCard";
import TablePagination from "../../components/TablePagination/TablePagination";
import useLocationPathname from "../../Hooks/useLocationPathname";
import { AppDispatch, RootState } from "../../redux/configStore";
import { getLocationPaginationApi } from "../../redux/reducers/locationsReducer";

let timeout: ReturnType<typeof setTimeout>;

type Props = {};

export default function Search({}: Props) {
  const { arrLocations, totalRow } = useSelector(
    (state: RootState) => state.locationsReducer
  );
  console.log(arrLocations);

  const dispatch: AppDispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 8;
  let keyword = searchParams.get("keyword");

  useEffect(() => {
    timeout = setTimeout(() => {
      if (keyword) {
        dispatch(getLocationPaginationApi(pageIndex, pageSize, keyword));
      }
    }, 1000);
    return () => timeout && clearTimeout(timeout);
  }, [pageIndex, pageSize, keyword]);

  useLocationPathname();

  return (
    <div className="container py-5">
      <h4>Tìm được {totalRow} kết quả theo từ khoá!</h4>
      <div className="row">
        {arrLocations?.map((location) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <LocationCard location={location} />
          </div>
        ))}
        <TablePagination
          totalRow={totalRow}
          currentPage={pageIndex}
          setCurrentPage={setPageIndex}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
