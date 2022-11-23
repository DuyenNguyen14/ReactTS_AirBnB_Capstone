import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import LocationCard from "../../components/Card/LocationCard";
import Loading from "../../components/Loading/Loading";
import TablePagination from "../../components/TablePagination/TablePagination";
import useLocationPathname from "../../Hooks/useLocationPathname";
import { AppDispatch, RootState } from "../../redux/configStore";
import {
  getLocationPaginationApi,
  setArrLocations,
  setTotalRow,
} from "../../redux/reducers/locationsReducer";

let timeout: ReturnType<typeof setTimeout>;

type Props = {};

export default function Search({}: Props) {
  const [fetching, setFetching] = useState(true);
  console.log(fetching);
  const navigate = useNavigate();

  const { arrLocations, totalRow } = useSelector(
    (state: RootState) => state.locationsReducer
  );

  const dispatch: AppDispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 8;
  let keyword = searchParams.get("keyword");

  useEffect(() => {
    timeout = setTimeout(() => {
      console.log("fetching");
      dispatch(getLocationPaginationApi(pageIndex, pageSize, keyword));
      setFetching(false);
    }, 1000);
    setFetching(true);
    return () => timeout && clearTimeout(timeout);
  }, [pageIndex, pageSize, keyword]);

  useEffect(() => {
    if (!keyword || keyword.trim() === "") {
      navigate("/");
    }
  }, [keyword]);

  useLocationPathname();

  return (
    <div className="container py-5">
      {fetching ? (
        <Loading />
      ) : (
        <>
          <h4>Tìm được {totalRow} kết quả theo từ khoá!</h4>
          <div className="row">
            {arrLocations?.map((location) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <LocationCard location={location} />
              </div>
            ))}
            <TablePagination
              totalRow={totalRow as number}
              currentPage={pageIndex}
              setCurrentPage={setPageIndex}
              pageSize={pageSize}
            />
          </div>
        </>
      )}
    </div>
  );
}
