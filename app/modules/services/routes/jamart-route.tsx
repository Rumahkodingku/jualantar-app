import { ServicePage } from "../components/service-page"
import { getServiceBySlug } from "../service-catalog"

const service = getServiceBySlug("jamart")

export default function JaMartRoute() {
    return <ServicePage service={service} />
}
