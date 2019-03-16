import { Package } from "src/package/package.entity";
import { PackageResponseDTO } from "src/package/package_response.dto";

/**
 * This interface exposes a strategy to send packages. This could be
 * either sending package to the nearest city, or pay the late delivery penalty.
 */
export interface SendingStrategy {
    send_package_to_city(p: Package):PackageResponseDTO;
}