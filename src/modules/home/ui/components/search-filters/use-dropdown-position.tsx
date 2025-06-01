import { RefObject } from "react"

export const useDropdownPosition = (ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>) => {
    const getDropdownPosition = () => {
        if (!ref.current) {
            // if we cannot get the div ref from category dropdown, we are not doing anything
            return { top: 0, left: 0 }
        }
        const rect = ref.current.getBoundingClientRect()
        // this is a rectangle got from getBoundingClient 
        const dropdownWidth = 240 // width of the dropdown (w-60 = 15rem = 240px)

        // calculate the initial position
        let left = rect.left + window.scrollX;
        const top = rect.bottom + window.scrollY;

        // below onwarrds we are making sure that the dropdown does not overflow

        //check if the dropdown goes out of the screen (viewport) on the right side
        if (left + dropdownWidth > window.innerWidth) {
            //align to the right side of the screen
            left = rect.right + window.scrollX - dropdownWidth // 16 is the padding of the container
        }
        //if still off screen
        if (left < 0) {
            left = window.innerWidth - dropdownWidth - 16
        }
        // ensure dropdown is not off screen
        if (left < 0) {
            left = 16
        }

        return { top, left }

    }
    return { getDropdownPosition }
} 