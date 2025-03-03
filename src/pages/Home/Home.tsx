import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import LocationCard from "../../components/Card/LocationCard";
import { AppDispatch, RootState } from "../../redux/configStore";
import {
  getLocationPaginationApi,
  Location,
  setArrLocations,
  setTotalRow,
} from "../../redux/reducers/locationsReducer";
import useLocationPathname from "../../Hooks/useLocationPathname";

let timeout: ReturnType<typeof setTimeout>;

type Props = {};

export default function Home({}: Props) {
  const { arrLocations, totalRow } = useSelector(
    (state: RootState) => state.locationsReducer
  );

  const [locationList, setLocationList] = useState<Location[]>([]);

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 8;
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver>();
  const lastLocationCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && totalRow !== locationList.length) {
          setPageIndex((prevPageIndex) => prevPageIndex + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (arrLocations.length > 0) {
      setLoading(true);
      timeout = setTimeout(() => {
        setLocationList((prevState) => {
          return [...prevState, ...arrLocations];
        });
        setLoading(false);
      }, 600);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [arrLocations]);

  const location = useLocationPathname();

  useEffect(() => {
    dispatch(getLocationPaginationApi(pageIndex, pageSize, ""));
  }, [pageIndex, pageSize]);

  useEffect(() => {
    return () => {
      console.log("clear");
      dispatch(setArrLocations([]));
      dispatch(setTotalRow(0));
    };
  }, []);

  return (
    <div className="container py-5">
      <div className="row">
        {locationList?.map((location, index) => {
          if (locationList.length === index + 1) {
            return (
              <>
                <div
                  ref={lastLocationCardRef}
                  key={location.id}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3"
                >
                  <LocationCard location={location} />
                </div>
              </>
            );
          }
          return (
            <div
              key={location.id}
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
            >
              <LocationCard location={location} />
            </div>
          );
        })}
        {locationList.length === totalRow ? "" : <Loading />}
      </div>
    </div>
  );
}
