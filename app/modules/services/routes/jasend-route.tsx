import { ServicePage } from "../components/service-page"
import { getServiceBySlug } from "../service-catalog"

const service = getServiceBySlug("jasend")

export default function JaSendRoute() {
    return <ServicePage service={service} />
}
