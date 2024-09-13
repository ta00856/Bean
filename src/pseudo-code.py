class Site:
    def __init__(self, is_in_conservation_area, is_in_national_park, 
                 is_in_world_heritage_site, is_in_area_of_outstanding_natural_beauty, 
                 is_adjacent_to_highway, height, is_next_to_listed_building, 
                 gate_opens_onto_public_road):
        """
        Initialize the Site object with various attributes that affect planning permission.
        """
        self.is_in_conservation_area = is_in_conservation_area
        self.is_in_national_park = is_in_national_park
        self.is_in_world_heritage_site = is_in_world_heritage_site
        self.is_in_area_of_outstanding_natural_beauty = is_in_area_of_outstanding_natural_beauty
        self.is_adjacent_to_highway = is_adjacent_to_highway
        self.height = height
        self.is_next_to_listed_building = is_next_to_listed_building
        self.gate_opens_onto_public_road = gate_opens_onto_public_road


def is_planning_permission_required(site):
    """
    Determine if planning permission is required for a fence, gate, or wall based on 
    various conditions related to the site.
    
    Parameters:
    site (Site): A Site object containing the details of the location and structure.
    
    Returns:
    bool: True if planning permission is required, False otherwise.
    """
    # Check if the site falls under universal categories where planning permission is required
    if (site.is_in_conservation_area or site.is_in_national_park or
        site.is_in_world_heritage_site or site.is_in_area_of_outstanding_natural_beauty):
        return True  # Planning permission is required
    
    # Check if the structure is adjacent to a highway and exceeds height limits
    if site.is_adjacent_to_highway and site.height > 1:
        return True  # Planning permission is required
    
    # Check if the structure is not adjacent to a highway and exceeds height limits
    if not site.is_adjacent_to_highway and site.height > 2:
        return True  # Planning permission is required
    
    # Check if the site is next to a listed building
    if site.is_next_to_listed_building:
        return True  # Planning permission is required
    
    # Check if the gate opens onto a public road
    if site.gate_opens_onto_public_road:
        return True  # Planning permission is required
    
    # If none of the conditions are met, no planning permission is required
    return False


# Example usage:
# Create a Site object with attributes for a particular location
site = Site(
    is_in_conservation_area=False, 
    is_in_national_park=False, 
    is_in_world_heritage_site=False, 
    is_in_area_of_outstanding_natural_beauty=False, 
    is_adjacent_to_highway=True, 
    height=1.5, 
    is_next_to_listed_building=False, 
    gate_opens_onto_public_road=False
)

# Check if planning permission is required
permission_required = is_planning_permission_required(site)

# Output the result
if permission_required:
    print("Planning permission is required for this site.")
else:
    print("Planning permission is not required for this site.")



